package services

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"auth-service/config"
	"auth-service/internal/logger"
	"auth-service/internal/mailer"
	"auth-service/internal/models"
	"auth-service/internal/repository"
)

type AuthService interface {
	RegisterUser(user *models.User, password string) error
	Login(email, password string, w http.ResponseWriter) error
	Logout(w http.ResponseWriter, refreshToken string) error
	RefreshToken(refreshToken string, w http.ResponseWriter) error
	ConfirmAccount(tokenString string) error
	RequestPasswordReset(email string) error
	ResetPassword(token, newPassword string) error
	ValidateToken(tokenString string) (*models.CustomClaims, error)
}

type authService struct {
	userRepo               repository.UserRepository
	tokenRepo              repository.ConfirmationTokenRepository
	passwordResetTokenRepo repository.PasswordResetTokenRepository
	refreshTokenRepo       repository.RefreshTokenRepository
	cfg                    *config.Config
	mailer                 mailer.Mailer
}

func NewAuthService(
	userRepo repository.UserRepository,
	tokenRepo repository.ConfirmationTokenRepository,
	passwordResetTokenRepo repository.PasswordResetTokenRepository,
	refreshTokenRepo repository.RefreshTokenRepository,
	cfg *config.Config,
	m mailer.Mailer,
) AuthService {
	logger.Info("Initializing AuthService")
	return &authService{
		userRepo:               userRepo,
		tokenRepo:              tokenRepo,
		passwordResetTokenRepo: passwordResetTokenRepo,
		refreshTokenRepo:       refreshTokenRepo,
		cfg:                    cfg,
		mailer:                 m,
	}
}

func (s *authService) RegisterUser(user *models.User, password string) error {
	existingUser, err := s.userRepo.GetUserByEmail(user.Email)
	if err == nil && existingUser != nil {
		logger.Error("User already exists: ", user.Email)
		return errors.New("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("Error hashing password for ", user.Email, ": ", err)
		return err
	}

	user.PasswordHash = string(hashedPassword)
	user.IsActive = false

	if user.Role == "" {
		user.Role = "user"
	}

	if user.Role != models.RoleUser && user.Role != models.RoleAdmin {
		logger.Error("Invalid role specified for user: ", user.Email)
		return errors.New("invalid role")
	}

	user.ID = uuid.New()

	if err := s.userRepo.CreateUser(user); err != nil {
		logger.Error("Error creating user ", user.Email, ": ", err)
		return err
	}

	if err := s.userRepo.CreateUserProfile(user.ID); err != nil {
		logger.Error("Error creating profile for user ", user.Email, ": ", err)
		// Не прерываем регистрацию, но логируем
	}

	confirmationToken, err := generateRandomToken(32)
	if err != nil {
		logger.Error("Error generating confirmation token: ", err)
		return err
	}

	token := &models.ConfirmationToken{
		UserID:    user.ID,
		Token:     confirmationToken,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	if err := s.tokenRepo.CreateToken(token); err != nil {
		logger.Error("Error saving confirmation token for user ", user.Email, ": ", err)
		return err
	}

	if err := s.mailer.SendConfirmationEmail(user.Email, confirmationToken); err != nil {
		logger.Error("Error sending confirmation email to ", user.Email, ": ", err)
		return err
	}

	return nil
}

func (s *authService) setAuthCookies(w http.ResponseWriter, accessToken, refreshToken string) {
	// Устанавливаем access token в httpOnly куку
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(s.cfg.JWTExpiry.Seconds()),
	})

	// Устанавливаем refresh token в httpOnly куку
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(s.cfg.RefreshExpiry.Seconds()),
	})
}

func (s *authService) clearAuthCookies(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})
}

func (s *authService) Login(email, password string, w http.ResponseWriter) error {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return errors.New("invalid credentials")
	}

	if !user.IsActive {
		return errors.New("account not activated")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return errors.New("invalid credentials")
	}

	// Генерируем токены
	accessToken, err := s.generateJWTToken(user, s.cfg.JWTExpiry)
	if err != nil {
		return err
	}

	refreshToken, err := s.generateRefreshToken(user)
	if err != nil {
		return err
	}

	// Сохраняем refresh token в БД
	refreshTokenModel := &models.RefreshToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(s.cfg.RefreshExpiry),
	}

	if err := s.refreshTokenRepo.CreateToken(refreshTokenModel); err != nil {
		return err
	}

	// Устанавливаем куки
	s.setAuthCookies(w, accessToken, refreshToken)

	return nil
}

func (s *authService) Logout(w http.ResponseWriter, refreshToken string) error {
	if refreshToken != "" {
		if err := s.refreshTokenRepo.RevokeToken(refreshToken); err != nil {
			logger.Error("Error revoking refresh token: ", err)
		}
	}

	s.clearAuthCookies(w)
	return nil
}

func (s *authService) RefreshToken(refreshToken string, w http.ResponseWriter) error {
	// Проверяем refresh token в БД
	token, err := s.refreshTokenRepo.GetToken(refreshToken)
	if err != nil {
		return errors.New("invalid refresh token")
	}

	// Получаем пользователя
	user, err := s.userRepo.GetUserByID(token.UserID)
	if err != nil {
		return errors.New("user not found")
	}

	// Генерируем новые токены
	accessToken, err := s.generateJWTToken(user, s.cfg.JWTExpiry)
	if err != nil {
		return err
	}

	newRefreshToken, err := s.generateRefreshToken(user)
	if err != nil {
		return err
	}

	// Сохраняем новый refresh token
	newToken := &models.RefreshToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		Token:     newRefreshToken,
		ExpiresAt: time.Now().Add(s.cfg.RefreshExpiry),
	}

	if err := s.refreshTokenRepo.CreateToken(newToken); err != nil {
		return err
	}

	// Отзываем старый refresh token
	if err := s.refreshTokenRepo.RevokeToken(refreshToken); err != nil {
		logger.Error("Error revoking old refresh token: ", err)
	}

	// Устанавливаем новые куки
	s.setAuthCookies(w, accessToken, newRefreshToken)

	return nil
}

func (s *authService) generateRefreshToken(user *models.User) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func (s *authService) generateJWTToken(user *models.User, expiry time.Duration) (string, error) {
	claims := &models.CustomClaims{
		UserID: user.ID.String(),
		Role:   string(user.Role),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}

func generateRandomToken(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		logger.Error("Error generating random bytes: ", err)
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func (s *authService) ConfirmAccount(tokenString string) error {
	confirmationToken, err := s.tokenRepo.GetTokenByString(tokenString)
	if err != nil {
		logger.Error("Invalid confirmation token: ", err)
		return errors.New("invalid token")
	}

	if time.Now().After(confirmationToken.ExpiresAt) {
		logger.Error("Confirmation token expired for user ", confirmationToken.UserID)
		return errors.New("token expired")
	}

	user, err := s.userRepo.GetUserByID(confirmationToken.UserID)
	if err != nil {
		logger.Error("Error retrieving user for confirmation: ", err)
		return err
	}

	user.IsActive = true
	if err := s.userRepo.UpdateUser(user); err != nil {
		logger.Error("Error updating user status for ", user.Email, ": ", err)
		return err
	}

	if err := s.tokenRepo.DeleteToken(tokenString); err != nil {
		logger.Error("Error deleting confirmation token: ", err)
	}

	return nil
}

func (s *authService) RequestPasswordReset(email string) error {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		logger.Error("User not found for password reset: ", email)
		return errors.New("user not found")
	}

	resetToken, err := generateRandomToken(32)
	if err != nil {
		logger.Error("Error generating password reset token for ", email, ": ", err)
		return err
	}

	tokenModel := &models.PasswordResetToken{
		UserID:    user.ID,
		Token:     resetToken,
		ExpiresAt: time.Now().Add(1 * time.Hour),
		Used:      false,
	}

	if err := s.passwordResetTokenRepo.CreateToken(tokenModel); err != nil {
		logger.Error("Error saving password reset token for ", email, ": ", err)
		return err
	}

	if err := s.mailer.SendPasswordResetEmail(user.Email, resetToken); err != nil {
		logger.Error("Error sending password reset email to ", email, ": ", err)
		return err
	}

	return nil
}

func (s *authService) ResetPassword(tokenStr, newPassword string) error {
	tokenModel, err := s.passwordResetTokenRepo.GetToken(tokenStr)
	if err != nil {
		logger.Error("Invalid password reset token: ", err)
		return errors.New("invalid token")
	}

	if tokenModel.Used {
		logger.Error("Password reset token already used for user ", tokenModel.UserID)
		return errors.New("token already used")
	}

	if time.Now().After(tokenModel.ExpiresAt) {
		logger.Error("Password reset token expired for user ", tokenModel.UserID)
		return errors.New("token expired")
	}

	user, err := s.userRepo.GetUserByID(tokenModel.UserID)
	if err != nil {
		logger.Error("Error retrieving user for password reset: ", err)
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("Error hashing new password for user ", user.Email, ": ", err)
		return err
	}
	user.PasswordHash = string(hashedPassword)

	if err := s.userRepo.UpdateUser(user); err != nil {
		logger.Error("Error updating password for user ", user.Email, ": ", err)
		return err
	}

	if err := s.passwordResetTokenRepo.MarkTokenUsed(tokenStr); err != nil {
		logger.Error("Error marking password reset token as used: ", err)
		return err
	}

	return nil
}

func (s *authService) ValidateToken(tokenString string) (*models.CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.cfg.JWTSecret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*models.CustomClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims.ExpiresAt == nil || claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("token expired")
	}

	return claims, nil
}
