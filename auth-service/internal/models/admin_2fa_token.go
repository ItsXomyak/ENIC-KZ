package models

import (
	"time"

	"github.com/google/uuid"
)

type Admin2FAToken struct {
	ID        int64     `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	Code      string    `db:"code"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
}
