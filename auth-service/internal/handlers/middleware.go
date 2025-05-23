package handlers

import (
	"context"
	"net/http"

	"authforge/config"
	"authforge/internal/models"
	"authforge/internal/services"
)

type ContextKey string

const ContextKeyClaims ContextKey = "claims"

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

			ctx := context.WithValue(r.Context(), ContextKeyClaims, claims)
			next(w, r.WithContext(ctx))
		}
	}
}

func FromContext(ctx context.Context) (*models.CustomClaims, bool) {
	claims, ok := ctx.Value(ContextKeyClaims).(*models.CustomClaims)
	return claims, ok
}
