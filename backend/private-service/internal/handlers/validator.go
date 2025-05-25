package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"private-service/config"
	"private-service/internal/logger"
	"private-service/internal/metrics"
	"private-service/internal/services"

	"github.com/google/uuid"
)

type ValidateHandler struct {
	AuthService services.AuthService
	cfg        *config.Config
}

// ValidateToken godoc
// @Summary Validate JWT token from cookie
// @Description Validates the access token from cookie and returns user claims
// @Tags auth
// @Produce json
// @Success 200 {object} map[string]interface{} "User claims including user_id, role, and expiresAt"
// @Failure 401 {object} ResponseMessage "Missing or invalid token"
// @Router /auth/validate [get]
func (h *AuthHandler) ValidateToken(w http.ResponseWriter, r *http.Request) {
	accessCookie, err := r.Cookie(config.AccessTokenCookieName)
	if err != nil {
		http.Error(w, "missing token", http.StatusUnauthorized)
		return
	}
	tokenStr := accessCookie.Value
	claims, err := h.AuthService.ValidateToken(tokenStr)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	// Получаем пользователя из базы данных
	userID, err := uuid.Parse(claims.UserID)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusInternalServerError)
		return
	}

	user, err := h.AuthService.GetUserByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "user not found", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id":   claims.UserID,
		"email":     user.Email,
		"role":      claims.Role,
		"expiresAt": claims.ExpiresAt.Time,
	})
}

type Verify2FARequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

// Verify2FA godoc
// @Summary Verify 2FA code for admin
// @Description Verifies 2FA code and issues JWT tokens in HTTP-only cookies if valid
// @Tags auth
// @Accept json
// @Produce json
// @Param input body Verify2FARequest true "Email and 2FA code"
// @Success 200 {object} ResponseMessage "2FA verification successful"
// @Failure 400 {object} ResponseMessage "Invalid code or expired code"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /auth/verify-2fa [post]
func (h *AuthHandler) Verify2FA(w http.ResponseWriter, r *http.Request) {
	logger.Info("2FA verification request received")
	var req Verify2FARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Invalid 2FA request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Email == "" || req.Code == "" {
		http.Error(w, "Email and code are required", http.StatusBadRequest)
		return
	}

	tokens, err := h.AuthService.Verify2FAByEmail(req.Email, req.Code)
	if err != nil {
		logger.Error("2FA verification failed for ", req.Email, ": ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	metrics.TwoFactorVerificationCounter.Inc()

	http.SetCookie(w, &http.Cookie{
		Name:     config.AccessTokenCookieName,
		Value:    tokens.AccessToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.JWTExpiry),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     config.RefreshTokenCookieName,
		Value:    tokens.RefreshToken,
		Path:     config.CookiePath,
		Expires:  time.Now().Add(h.cfg.RefreshExpiry),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Message: "2FA verification successful"})
}
