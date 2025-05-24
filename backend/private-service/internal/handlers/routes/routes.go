package routes

import (
	"net/http"

	"private-service/internal/handlers"
	"private-service/internal/models"

	httpSwagger "github.com/swaggo/http-swagger"
)

func RegisterRoutes(
	authHandler *handlers.AuthHandler,
	confirmHandler *handlers.ConfirmHandler,
	passwordResetHandler *handlers.PasswordResetHandler,
	adminHandler *handlers.AdminHandler,
) {
	http.HandleFunc("/api/v1/auth/register", authHandler.Register)
	http.HandleFunc("/api/v1/auth/login", authHandler.Login)
	http.HandleFunc("/api/v1/auth/confirm", confirmHandler.ConfirmAccount)
	http.HandleFunc("/api/v1/auth/password-reset-request", passwordResetHandler.RequestPasswordReset)
	http.HandleFunc("/api/v1/auth/password-reset-confirm", passwordResetHandler.ResetPassword)
	http.HandleFunc("/api/v1/auth/verify-2fa", authHandler.Verify2FA)
	http.HandleFunc(
		"/api/v1/auth/validate",
		handlers.AuthMiddleware(authHandler.AuthService)(authHandler.ValidateToken),
	)

	// Admin routes with role-based middleware
	http.HandleFunc(
		"/api/v1/admin/users",
		handlers.RoleMiddleware(authHandler.AuthService, []models.UserRole{models.RoleAdmin, models.RoleRootAdmin})(adminHandler.ListUsers),
	)
	http.HandleFunc(
		"/api/v1/admin/metrics",
		handlers.RoleMiddleware(authHandler.AuthService, []models.UserRole{models.RoleAdmin, models.RoleRootAdmin})(adminHandler.GetMetrics),
	)
	http.HandleFunc(
		"/api/v1/admin/promote",
		handlers.RoleMiddleware(authHandler.AuthService, []models.UserRole{models.RoleAdmin, models.RoleRootAdmin})(adminHandler.PromoteToAdmin),
	)
	http.HandleFunc(
		"/api/v1/admin/demote",
		handlers.RoleMiddleware(authHandler.AuthService, []models.UserRole{models.RoleRootAdmin})(adminHandler.DemoteToUser),
	)
	http.HandleFunc(
		"/api/v1/admin/users/delete",
		handlers.RoleMiddleware(authHandler.AuthService, []models.UserRole{models.RoleAdmin, models.RoleRootAdmin})(adminHandler.DeleteUser),
	)

	http.Handle("/swagger/", httpSwagger.WrapHandler)
}
