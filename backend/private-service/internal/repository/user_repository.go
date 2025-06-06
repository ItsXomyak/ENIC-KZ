package repository

import (
	"database/sql"
	"errors"
	"time"

	"private-service/internal/logger"
	"private-service/internal/models"

	"github.com/google/uuid"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id uuid.UUID) (*models.User, error)
	UpdateUser(user *models.User) error
	DeleteUser(id uuid.UUID) error
	GetAllUsers() ([]models.User, error)
}

type PostgresUserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &PostgresUserRepository{DB: db}
}

func (r *PostgresUserRepository) CreateUser(user *models.User) error {
	query := `
		INSERT INTO users (
			id, email, password_hash, is_active, is_2fa_enabled, role,
			created_at, updated_at, failed_login_attempts, last_failed_login
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	now := time.Now()
	user.ID = uuid.New()
	user.CreatedAt = now
	user.UpdatedAt = now

	_, err := r.DB.Exec(query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.IsActive,
		user.Is2FAEnabled,
		user.Role,
		user.CreatedAt,
		user.UpdatedAt,
		user.FailedLoginAttempts,
		user.LastFailedLogin,
	)

	if err != nil {
		logger.Error("Error creating user with email ", user.Email, ": ", err)
	}
	return err
}

func (r *PostgresUserRepository) GetUserByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, is_active, is_2fa_enabled, role, created_at, updated_at, failed_login_attempts, last_failed_login
		FROM users WHERE email = $1`
	user := &models.User{}
	err := r.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.IsActive,
		&user.Is2FAEnabled,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.FailedLoginAttempts,
		&user.LastFailedLogin,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			logger.Error("User not found with email ", email)
			return nil, errors.New("user not found")
		}
		logger.Error("Error fetching user by email ", email, ": ", err)
		return nil, err
	}
	return user, nil
}

func (r *PostgresUserRepository) GetUserByID(id uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, is_active, is_2fa_enabled,  role, created_at, updated_at, failed_login_attempts, last_failed_login
		FROM users WHERE id = $1`
	user := &models.User{}
	err := r.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.IsActive,
		&user.Is2FAEnabled,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.FailedLoginAttempts,
		&user.LastFailedLogin,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			logger.Error("User not found with ID ", id)
			return nil, errors.New("user not found")
		}
		logger.Error("Error fetching user by ID ", id, ": ", err)
		return nil, err
	}
	return user, nil
}

func (r *PostgresUserRepository) UpdateUser(user *models.User) error {
	query := `
		UPDATE users 
		SET email = $1,
		    password_hash = $2,
		    is_active = $3,
		    is_2fa_enabled = $4,
		    role = $5,
		    updated_at = $6,
		    failed_login_attempts = $7,
		    last_failed_login = $8
		WHERE id = $9`

	user.UpdatedAt = time.Now()

	_, err := r.DB.Exec(query,
		user.Email,
		user.PasswordHash,
		user.IsActive,
		user.Is2FAEnabled,
		user.Role,
		user.UpdatedAt,
		user.FailedLoginAttempts,
		user.LastFailedLogin,
		user.ID,
	)

	if err != nil {
		logger.Error("Error updating user with ID ", user.ID, ": ", err)
	}
	return err
}

func (r *PostgresUserRepository) DeleteUser(id uuid.UUID) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.DB.Exec(query, id)
	if err != nil {
		logger.Error("Error deleting user with ID ", id, ": ", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		logger.Error("Error getting rows affected for user deletion with ID ", id, ": ", err)
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *PostgresUserRepository) GetAllUsers() ([]models.User, error) {
	query := `
		SELECT id, email, password_hash, is_active, is_2fa_enabled, role, created_at, updated_at, failed_login_attempts, last_failed_login
		FROM users
		ORDER BY created_at DESC`

	rows, err := r.DB.Query(query)
	if err != nil {
		logger.Error("Error fetching all users: ", err)
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.PasswordHash,
			&user.IsActive,
			&user.Is2FAEnabled,
			&user.Role,
			&user.CreatedAt,
			&user.UpdatedAt,
			&user.FailedLoginAttempts,
			&user.LastFailedLogin,
		)
		if err != nil {
			logger.Error("Error scanning user row: ", err)
			return nil, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		logger.Error("Error iterating user rows: ", err)
		return nil, err
	}

	return users, nil
}
