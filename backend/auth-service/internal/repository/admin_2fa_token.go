package repository

import (
	"database/sql"

	"authforge/internal/logger"
	"authforge/internal/models"
)

type Admin2FATokenRepository interface {
	Create(token *models.Admin2FAToken) error
	Validate(userID string, code string) (bool, error)
}

type PostgresAdmin2FATokenRepository struct {
	DB *sql.DB
}

func NewAdmin2FATokenRepository(db *sql.DB) Admin2FATokenRepository {
	return &PostgresAdmin2FATokenRepository{DB: db}
}

func (r *PostgresAdmin2FATokenRepository) Create(token *models.Admin2FAToken) error {
	query := `INSERT INTO admin_2fa_tokens (user_id, code, expires_at) VALUES ($1, $2, $3)`
	_, err := r.DB.Exec(query, token.UserID, token.Code, token.ExpiresAt)
	if err != nil {
		logger.Error("Error creating 2FA token: ", err)
	}
	return err
}

func (r *PostgresAdmin2FATokenRepository) Validate(userID string, code string) (bool, error) {
	query := `
		SELECT COUNT(*) FROM admin_2fa_tokens
		WHERE user_id = $1 AND code = $2 AND expires_at > NOW()
	`
	var count int
	err := r.DB.QueryRow(query, userID, code).Scan(&count)
	return count > 0, err
}
