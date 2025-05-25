package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"api-gateway/config"
	"api-gateway/config/metrics"
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
}

const (
	RoleUser      = "user"
	RoleAdmin     = "admin"
	RoleRootAdmin = "root_admin"
)

// AuthMiddleware проверяет JWT токен и собирает метрики аутентификации
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err != nil || accessToken == "" {
			metrics.AuthenticationTotal.WithLabelValues("missing_token").Inc()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token cookie is required"})
			c.Abort()
			return
		}

		// Проверка валидности токена (например, JWT)
		if !isValidToken(accessToken) {
			metrics.AuthenticationTotal.WithLabelValues("invalid_token").Inc()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		metrics.AuthenticationTotal.WithLabelValues("success").Inc()
		c.Next()
	}
}


func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin, exists := c.Get("isAdmin")
		if !exists || !isAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied: admin only"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func RootAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		isRootAdmin, exists := c.Get("isRootAdmin")
		if !exists || !isRootAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied: root admin only"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// isValidToken проверяет валидность JWT токена
func isValidToken(token string) bool {
	// Здесь должна быть реальная проверка JWT токена
	// Это просто заглушка для примера
	return len(token) > 0 && !strings.Contains(token, "invalid")
}

// isRateLimitExceeded проверяет, не превышен ли лимит запросов
func isRateLimitExceeded(clientIP, service string) bool {
	// Здесь должна быть реальная проверка лимитов
	// Это просто заглушка для примера
	return false
}

// RateLimitMiddleware ограничивает количество запросов и собирает метрики
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		service := GetServiceFromPath(c.FullPath())

		// Проверяем лимиты запросов
		if isRateLimitExceeded(clientIP, service) {
			metrics.RateLimitExceeded.WithLabelValues(service, clientIP).Inc()
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded"})
			c.Abort()
			return
		}

		c.Next()
	}
}
