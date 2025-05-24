package handlers

import (
	"context"
	"net/http"

	"private-service/config"
	"private-service/internal/models"
	"private-service/internal/services"
)

type ContextKey string

const ContextKeyClaims ContextKey = "claims"

func AuthMiddleware(authSvc services.AuthService) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			var tokenStr string

			authHeader := r.Header.Get("Authorization")
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				tokenStr = authHeader[7:]
			} else {
				c, err := r.Cookie(config.AccessTokenCookieName)
				if err != nil {
					http.Error(w, "unauthorized: missing token", http.StatusUnauthorized)
					return
				}
				tokenStr = c.Value
			}

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

func RoleMiddleware(authSvc services.AuthService, allowedRoles []models.UserRole) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return AuthMiddleware(authSvc)(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := FromContext(r.Context())
			if !ok {
				http.Error(w, "unauthorized: missing claims", http.StatusUnauthorized)
				return
			}

			userRole := models.UserRole(claims.Role)
			isAllowed := false
			for _, role := range allowedRoles {
				if userRole == role {
					isAllowed = true
					break
				}
			}

			if !isAllowed {
				http.Error(w, "forbidden: insufficient permissions", http.StatusForbidden)
				return
			}

			next(w, r)
		})
	}
}

func FromContext(ctx context.Context) (*models.CustomClaims, bool) {
	claims, ok := ctx.Value(ContextKeyClaims).(*models.CustomClaims)
	return claims, ok
}
