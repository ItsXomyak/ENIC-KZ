package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"private-service/config"
	"private-service/internal/logger"
	"private-service/internal/metrics"
	"private-service/internal/models"
	"private-service/internal/services"
)

type AuthHandler struct {
	AuthService services.AuthService
	cfg         *config.Config
}

func NewAuthHandler(authService services.AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		AuthService: authService,
		cfg:         cfg,
	}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ResponseMessage struct {
	Message string `json:"message"`
}

// Register godoc
// @Summary Register a new user
// @Description Creates a new user account and sends confirmation email
// @Tags auth
// @Accept json
// @Produce json
// @Param input body RegisterRequest true "User credentials"
// @Success 200 {object} ResponseMessage "Registration successful message"
// @Failure 400 {object} ResponseMessage "Invalid input or missing fields"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /auth/register [post]
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	logger.Info("Registration request received")

	var req RegisterRequest
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&req); err != nil {
		logger.Error("Invalid request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		logger.Error("Email and password are required")
		http.Error(w, "Email and password required", http.StatusBadRequest)
		return
	}

	user := &models.User{
		Email: req.Email,
		Role:  models.RoleUser,
	}

	if err := h.AuthService.RegisterUser(user, req.Password); err != nil {
		logger.Error("Registration failed: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	metrics.RegistrationCounter.Inc()
	logger.Info("User registered successfully: ", req.Email)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{
		Message: "Registration successful. Please check your email to activate your account.",
	})
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

// Login godoc
// @Summary Log in a user
// @Description Authenticates user and returns JWT tokens in HTTP-only cookies
// @Tags auth
// @Accept json
// @Produce json
// @Param input body LoginRequest true "Email and password"
// @Success 200 {object} ResponseMessage "Login successful message"
// @Failure 400 {object} ResponseMessage "Invalid input or missing fields"
// @Failure 401 {object} ResponseMessage "Invalid credentials or account not confirmed"
// @Router /auth/login [post]
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	logger.Info("Login request received")
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Invalid request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Password == "" {
		logger.Error("Email and password are required for login")
		http.Error(w, "Email and password required", http.StatusBadRequest)
		return
	}

	tokens, err := h.AuthService.Login(req.Email, req.Password)
	if err != nil {
		logger.Error("Login failed for ", req.Email, ": ", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	metrics.LoginCounter.Inc()

	http.SetCookie(w, &http.Cookie{
		Name:     config.AccessTokenCookieName,
		Value:    tokens.AccessToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.JWTExpiry),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteNoneMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     config.RefreshTokenCookieName,
		Value:    tokens.RefreshToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.RefreshExpiry),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteNoneMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Message: "Login successful"})
}

// Logout godoc
// @Summary Log out a user
// @Description Removes authentication cookies
// @Tags auth
// @Produce json
// @Success 200 {object} ResponseMessage "Logout successful"
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	// Удаляем куки, устанавливая их срок действия в прошлое
	http.SetCookie(w, &http.Cookie{
		Name:     config.AccessTokenCookieName,
		Value:    "",
		Path:     config.CookiePath,
		Expires:  time.Now().Add(-24 * time.Hour),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     config.RefreshTokenCookieName,
		Value:    "",
		Path:     config.CookiePath,
		Expires:  time.Now().Add(-24 * time.Hour),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Message: "Logout successful"})
}
