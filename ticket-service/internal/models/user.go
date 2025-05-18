package models

import "time"

type User struct {
    ID              string    `json:"id"`
    Email           string    `json:"email"`
    DisplayName     string    `json:"display_name"`
    IsActive        bool      `json:"is_active"`
    Role            string    `json:"role"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
    FailedLoginAttempts int    `json:"failed_login_attempts"`
    LastFailedLogin time.Time `json:"last_failed_login"`
}
