package handlers

import (
	"context"
	"net/http"

	"authforge/config"
	"authforge/internal/models"
	"authforge/internal/services"
)

// ContextKey – тип для ключей в контексте
type ContextKey string

// ContextKeyClaims – ключ, под которым мы положим CustomClaims
const ContextKeyClaims ContextKey = "claims"

// AuthMiddleware возвращает обёртку над http.HandlerFunc
// которая проверяет JWT в cookie и добавляет claims в контекст.
func AuthMiddleware(authSvc services.AuthService) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			c, err := r.Cookie(config.AccessTokenCookieName)
			if err != nil {
				http.Error(w, "unauthorized: missing token", http.StatusUnauthorized)
				return
			}
			tokenStr := c.Value

			claims, err := authSvc.ValidateToken(tokenStr)
			if err != nil {
				http.Error(w, "unauthorized: invalid token", http.StatusUnauthorized)
				return
			}

			// Кладём claims в контекст
			ctx := context.WithValue(r.Context(), ContextKeyClaims, claims)
			next(w, r.WithContext(ctx))
		}
	}
}

// FromContext возвращает CustomClaims, если они были положены в контекст
func FromContext(ctx context.Context) (*models.CustomClaims, bool) {
	claims, ok := ctx.Value(ContextKeyClaims).(*models.CustomClaims)
	return claims, ok
}
