package services

import (
	"context"
	"errors"
	"private-service/internal/models"
	"time"

	"github.com/google/uuid"
)

var (
	ErrUnauthorized     = errors.New("unauthorized access")
	ErrUserNotFound     = errors.New("user not found")
	ErrInvalidRole      = errors.New("invalid role")
	ErrCannotModifyRoot = errors.New("cannot modify root admin")
)

type AdminService struct {
	authService AuthService
}

func NewAdminService(authService AuthService) *AdminService {
	return &AdminService{
		authService: authService,
	}
}

// PromoteToAdmin promotes a user to admin role
func (s *AdminService) PromoteToAdmin(ctx context.Context, adminID, userID uuid.UUID) error {
	admin, err := s.authService.GetUserByID(ctx, adminID)
	if err != nil {
		return err
	}

	if admin.Role != models.RoleAdmin && admin.Role != models.RoleRootAdmin {
		return ErrUnauthorized
	}

	user, err := s.authService.GetUserByID(ctx, userID)
	if err != nil {
		if err == ErrUserNotFound {
			// Create new user with admin role if doesn't exist
			// This should be implemented in the auth service
			return err
		}
		return err
	}

	if user.Role == models.RoleRootAdmin {
		return ErrCannotModifyRoot
	}

	user.Role = models.RoleAdmin
	user.UpdatedAt = time.Now()

	return s.authService.UpdateUser(ctx, user)
}

// DemoteToUser demotes an admin to user role (only available for root admin)
func (s *AdminService) DemoteToUser(ctx context.Context, rootAdminID, adminID uuid.UUID) error {
	rootAdmin, err := s.authService.GetUserByID(ctx, rootAdminID)
	if err != nil {
		return err
	}

	if rootAdmin.Role != models.RoleRootAdmin {
		return ErrUnauthorized
	}

	admin, err := s.authService.GetUserByID(ctx, adminID)
	if err != nil {
		return err
	}

	if admin.Role == models.RoleRootAdmin {
		return ErrCannotModifyRoot
	}

	if admin.Role != models.RoleAdmin {
		return ErrInvalidRole
	}

	admin.Role = models.RoleUser
	admin.UpdatedAt = time.Now()

	return s.authService.UpdateUser(ctx, admin)
}

// DeleteUser deletes a user or admin (admin can delete users, root admin can delete both)
func (s *AdminService) DeleteUser(ctx context.Context, adminID, targetUserID uuid.UUID) error {
	admin, err := s.authService.GetUserByID(ctx, adminID)
	if err != nil {
		return err
	}

	if admin.Role != models.RoleAdmin && admin.Role != models.RoleRootAdmin {
		return ErrUnauthorized
	}

	targetUser, err := s.authService.GetUserByID(ctx, targetUserID)
	if err != nil {
		return err
	}

	if targetUser.Role == models.RoleRootAdmin {
		return ErrCannotModifyRoot
	}

	// Regular admin can only delete users
	if admin.Role == models.RoleAdmin && targetUser.Role == models.RoleAdmin {
		return ErrUnauthorized
	}

	return s.authService.DeleteUser(ctx, targetUserID)
}

// ListUsers returns all users in the system (available for both admin and root admin)
func (s *AdminService) ListUsers(ctx context.Context, adminID uuid.UUID) ([]models.User, error) {
	admin, err := s.authService.GetUserByID(ctx, adminID)
	if err != nil {
		return nil, err
	}

	if admin.Role != models.RoleAdmin && admin.Role != models.RoleRootAdmin {
		return nil, ErrUnauthorized
	}

	return s.authService.GetAllUsers(ctx)
}

// GetMetrics returns system metrics (available for both admin and root admin)
func (s *AdminService) GetMetrics(ctx context.Context, adminID uuid.UUID) (interface{}, error) {
	admin, err := s.authService.GetUserByID(ctx, adminID)
	if err != nil {
		return nil, err
	}

	if admin.Role != models.RoleAdmin && admin.Role != models.RoleRootAdmin {
		return nil, ErrUnauthorized
	}

	// TODO: Implement metrics collection and return
	return nil, nil
}
