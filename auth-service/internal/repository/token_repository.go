package repository

import (
	"database/sql"
	"time"

	"auth-service/internal/models"

	"github.com/google/uuid"
)

type RefreshTokenRepository interface {
	CreateToken(token *models.RefreshToken) error
	GetToken(token string) (*models.RefreshToken, error)
	RevokeToken(token string) error
	RevokeAllUserTokens(userID uuid.UUID) error
	DeleteExpiredTokens() error
}

type refreshTokenRepository struct {
	db *sql.DB
}

func NewRefreshTokenRepository(db *sql.DB) RefreshTokenRepository {
	return &refreshTokenRepository{db: db}
}

func (r *refreshTokenRepository) CreateToken(token *models.RefreshToken) error {
	query := `
		INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(query,
		token.ID,
		token.UserID,
		token.Token,
		token.ExpiresAt,
		time.Now(),
		time.Now(),
	)
	return err
}

func (r *refreshTokenRepository) GetToken(token string) (*models.RefreshToken, error) {
	query := `
		SELECT id, user_id, token, expires_at, is_revoked, created_at, updated_at
		FROM refresh_tokens
		WHERE token = $1 AND is_revoked = false AND expires_at > $2
	`
	var t models.RefreshToken
	err := r.db.QueryRow(query, token, time.Now()).Scan(
		&t.ID,
		&t.UserID,
		&t.Token,
		&t.ExpiresAt,
		&t.IsRevoked,
		&t.CreatedAt,
		&t.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *refreshTokenRepository) RevokeToken(token string) error {
	query := `
		UPDATE refresh_tokens
		SET is_revoked = true, updated_at = $1
		WHERE token = $2
	`
	_, err := r.db.Exec(query, time.Now(), token)
	return err
}

func (r *refreshTokenRepository) RevokeAllUserTokens(userID uuid.UUID) error {
	query := `
		UPDATE refresh_tokens
		SET is_revoked = true, updated_at = $1
		WHERE user_id = $2 AND is_revoked = false
	`
	_, err := r.db.Exec(query, time.Now(), userID)
	return err
}

func (r *refreshTokenRepository) DeleteExpiredTokens() error {
	query := `
		DELETE FROM refresh_tokens
		WHERE expires_at < $1 OR is_revoked = true
	`
	_, err := r.db.Exec(query, time.Now())
	return err
} 