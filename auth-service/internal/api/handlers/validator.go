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
