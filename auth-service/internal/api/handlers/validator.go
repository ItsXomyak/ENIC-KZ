package handlers

import (
	"authforge/config"
	"authforge/internal/services"
	"encoding/json"
	"net/http"
)

type ValidateHandler struct {
	AuthService services.AuthService
}

// ValidateToken godoc
// @Summary Validate JWT token from cookie
// @Description Returns user claims if token is valid
// @Tags auth
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 401 {string} string "Unauthorized"
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
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id":   claims.UserID,
		"role":      claims.Role,
		"expiresAt": claims.ExpiresAt.Time,
	})
}
