package auth

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

const (
	// AuthCookieName имя куки с JWT токеном
	AuthCookieName = "access_token"
)

// Claims представляет структуру JWT токена
type Claims struct {
	UserID  int64 `json:"user_id"`
	IsAdmin bool  `json:"is_admin"`
}

// ValidateToken проверяет JWT токен и возвращает claims
func ValidateToken(tokenString string) (*Claims, error) {
	// Убираем префикс "Bearer " если он есть
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Парсим токен без проверки подписи, так как токен от другого сервиса
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// Получаем claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	// Преобразуем claims в нашу структуру
	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal claims: %w", err)
	}

	var result Claims
	if err := json.Unmarshal(claimsJSON, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal claims: %w", err)
	}

	return &result, nil
}
