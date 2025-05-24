package middleware

import (
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"ticket-service/internal/logger"
)

const (
	authCookieName = "auth_token"
	userIDKey      = "userID"
	isAdminKey     = "isAdmin"
)

// AuthMiddleware проверяет JWT токен из куки
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie(authCookieName)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		claims, err := validateToken(token)
		if err != nil {
			logger.Error("Invalid token", "error", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// Сохраняем информацию о пользователе в контексте
		c.Set(userIDKey, claims.UserID)
		c.Set(isAdminKey, claims.IsAdmin)

		c.Next()
	}
}

// AdminOnly проверяет, что пользователь является администратором
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin, exists := c.Get(isAdminKey)
		if !exists || !isAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Claims представляет структуру JWT токена
type Claims struct {
	UserID    int64     `json:"user_id"`
	IsAdmin   bool      `json:"is_admin"`
	ExpiresAt time.Time `json:"exp"`
	IssuedAt  time.Time `json:"iat"`
	NotBefore time.Time `json:"nbf"`
	Issuer    string    `json:"iss"`
	Subject   string    `json:"sub"`
	Audience  []string  `json:"aud"`
}

// GetExpirationTime возвращает время истечения токена
func (c *Claims) GetExpirationTime() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(c.ExpiresAt), nil
}

// GetNotBefore возвращает время начала действия токена
func (c *Claims) GetNotBefore() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(c.NotBefore), nil
}

// GetIssuedAt возвращает время создания токена
func (c *Claims) GetIssuedAt() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(c.IssuedAt), nil
}

// GetIssuer возвращает издателя токена
func (c *Claims) GetIssuer() (string, error) {
	return c.Issuer, nil
}

// GetSubject возвращает субъект токена
func (c *Claims) GetSubject() (string, error) {
	return c.Subject, nil
}

// GetAudience возвращает аудиторию токена
func (c *Claims) GetAudience() (jwt.ClaimStrings, error) {
	return jwt.ClaimStrings(c.Audience), nil
}

// validateToken проверяет JWT токен и возвращает claims
func validateToken(tokenString string) (*Claims, error) {
	// Получаем секретный ключ из переменных окружения
	secretKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	if len(secretKey) == 0 {
		return nil, errors.New("JWT secret key is not set")
	}

	// Парсим токен
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Проверяем метод подписи
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	// Проверяем валидность токена
	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	// Получаем claims
	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	// Проверяем срок действия токена
	if claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("token has expired")
	}

	return claims, nil
}
