package handlers

import (
	"encoding/json"
	"net/http"

	"auth-service/internal/logger"
	"auth-service/internal/models"
	"auth-service/internal/services"
)

// @Summary Регистрация нового пользователя
// @Description Регистрирует нового пользователя и отправляет email для подтверждения
// @Tags auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Данные для регистрации"
// @Success 200 {object} ResponseMessage
// @Failure 400 {string} string "Неверные данные запроса"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /auth/register [post]
type AuthHandler struct {
	AuthService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{
		AuthService: authService,
	}
}

type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
	Role        string `json:"role"`
}

type ResponseMessage struct {
	Message string `json:"message"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	logger.Info("Registration request received")
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Invalid request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Password == "" || req.DisplayName == "" {
		logger.Error("Email, password and display name are required")
		http.Error(w, "Email, password and display name required", http.StatusBadRequest)
		return
	}

	user := &models.User{
		Email:       req.Email,
		Role:        models.UserRole(req.Role),
		DisplayName: req.DisplayName,
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

// @Summary Вход в систему
// @Description Аутентифицирует пользователя и устанавливает JWT токены в куки
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Данные для входа"
// @Success 200 {object} ResponseMessage
// @Failure 400 {string} string "Неверные данные запроса"
// @Failure 401 {string} string "Неверные учетные данные"
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

	if err := h.AuthService.Login(req.Email, req.Password, w); err != nil {
		logger.Error("Login failed for ", req.Email, ": ", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	logger.Info("User logged in successfully: ", req.Email)
	resp := ResponseMessage{Message: "Login successful"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// @Summary Выход из системы
// @Description Выходит из системы и отзывает токены
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} ResponseMessage
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	logger.Info("Logout request received")

	// Получаем refresh token из куки
	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err == nil && refreshTokenCookie != nil {
		if err := h.AuthService.Logout(w, refreshTokenCookie.Value); err != nil {
			logger.Error("Error during logout: ", err)
			http.Error(w, "Error during logout", http.StatusInternalServerError)
			return
		}
	} else {
		// Если куки нет, просто очищаем куки
		h.AuthService.Logout(w, "")
	}

	logger.Info("User logged out successfully")
	resp := ResponseMessage{Message: "Logout successful"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// @Summary Обновление токена
// @Description Обновляет access и refresh токены
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} ResponseMessage
// @Failure 401 {string} string "Неверный refresh token"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /auth/refresh [post]
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	logger.Info("Refresh token request received")

	refreshTokenCookie, err := r.Cookie("refresh_token")
	if err != nil {
		logger.Error("Refresh token cookie not found")
		http.Error(w, "Refresh token required", http.StatusUnauthorized)
		return
	}

	if err := h.AuthService.RefreshToken(refreshTokenCookie.Value, w); err != nil {
		logger.Error("Token refresh failed: ", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	logger.Info("Tokens refreshed successfully")
	resp := ResponseMessage{Message: "Tokens refreshed successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
