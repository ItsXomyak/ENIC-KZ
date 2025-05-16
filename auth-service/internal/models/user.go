package models

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

// UserRole представляет роль пользователя
// @Description Роль пользователя в системе
type UserRole string

const (
	RoleUser  UserRole = "user"
	RoleAdmin UserRole = "admin"
)

// User представляет модель пользователя
// @Description Информация о пользователе
type User struct {
	// ID пользователя
	ID                  uuid.UUID `json:"id" db:"id" swaggertype:"string" format:"uuid"`
	// Email пользователя
	Email               string    `json:"email" db:"email" binding:"required,email"`
	// Хеш пароля
	PasswordHash        string    `json:"-" db:"password_hash" swaggerignore:"true"`
	// Отображаемое имя
	DisplayName         string    `json:"displayName" db:"display_name" binding:"required"`
	// Роль пользователя (user/admin)
	Role                UserRole  `json:"role" db:"role" binding:"required"`
	// Флаг активности аккаунта
	IsActive            bool      `json:"isActive" db:"is_active"`
	CreatedAt           time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt           time.Time `json:"updatedAt" db:"updated_at"`
	FailedLoginAttempts int       `json:"failedLoginAttempts" db:"failed_login_attempts"`
	LastFailedLogin     time.Time `json:"lastFailedLogin" db:"last_failed_login"`
}

type UserProfile struct {
	UserID    uuid.UUID `json:"userId" db:"user_id"`
	Login     string    `json:"login" db:"login"`
	Bio       string    `json:"bio" db:"bio"`
	AvatarURL string    `json:"avatarUrl" db:"avatar_url"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

type ProfileComment struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"userId" db:"user_id"`
	ProfileID uuid.UUID `json:"profileId" db:"profile_id"`
	Content   string    `json:"content" db:"content"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

// CustomClaims представляет JWT claims
// @Description JWT токен claims
type CustomClaims struct {
	UserID string `json:"userId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}
