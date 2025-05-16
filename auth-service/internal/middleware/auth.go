package middleware

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"auth-service/internal/logger"
	"auth-service/internal/metrics"
	"auth-service/internal/services"
)

func AuthMiddleware(authService services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Получаем access token из куки
			cookie, err := r.Cookie("access_token")
			if err != nil {
				logger.Error("Access token cookie not found")
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Проверяем токен
			claims, err := authService.ValidateToken(cookie.Value)
			if err != nil {
				logger.Error("Invalid access token: ", err)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Добавляем claims в контекст запроса
			ctx := r.Context()
			ctx = context.WithValue(ctx, "user_id", claims.UserID)
			ctx = context.WithValue(ctx, "role", claims.Role)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RoleMiddleware(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			role := r.Context().Value("role").(string)
			for _, allowedRole := range roles {
				if role == allowedRole {
					next.ServeHTTP(w, r)
					return
				}
			}
			http.Error(w, "Forbidden", http.StatusForbidden)
		})
	}
} 

func MetricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Обернём ResponseWriter, чтобы получить код
		rr := &responseRecorder{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(rr, r)

		duration := time.Since(start).Seconds()

		metrics.HttpRequestsTotal.WithLabelValues(r.URL.Path, r.Method, strconv.Itoa(rr.statusCode)).Inc()
		metrics.HttpRequestDuration.WithLabelValues(r.URL.Path).Observe(duration)
	})
}

type responseRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (r *responseRecorder) WriteHeader(code int) {
	r.statusCode = code
	r.ResponseWriter.WriteHeader(code)
}