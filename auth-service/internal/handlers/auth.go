package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"authforge/config"
	"authforge/internal/logger"
	"authforge/internal/models"
	"authforge/internal/services"
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
	Role     string `json:"role"`
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
// @Success 200 {object} ResponseMessage
// @Failure 400 {string} string "Invalid input"
// @Failure 500 {string} string "Internal error"
// @Router /auth/register [post]
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	logger.Info("Registration request received")
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
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
		Role:  models.UserRole(req.Role),
	}

	if err := h.AuthService.RegisterUser(user, req.Password); err != nil {
		logger.Error("Registration failed: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	logger.Info("User registered successfully: ", req.Email)
	resp := ResponseMessage{Message: "Registration successful. Please check your email to activate your account."}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
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
// @Description Authenticates user and sets access and refresh JWT cookies
// @Tags auth
// @Accept json
// @Produce json
// @Param input body LoginRequest true "Email and password"
// @Success 200 {object} ResponseMessage
// @Failure 400 {string} string "Invalid input"
// @Failure 401 {string} string "Unauthorized"
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

	http.SetCookie(w, &http.Cookie{
		Name:     config.AccessTokenCookieName,
		Value:    tokens.AccessToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.JWTExpiry),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     config.RefreshTokenCookieName,
		Value:    tokens.RefreshToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.RefreshExpiry),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Message: "Login successful"})
}
