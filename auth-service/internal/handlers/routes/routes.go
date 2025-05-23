package routes

import (
	"net/http"

	"authforge/internal/handlers"

	httpSwagger "github.com/swaggo/http-swagger"
)

func RegisterRoutes(
	authHandler *handlers.AuthHandler,
	confirmHandler *handlers.ConfirmHandler,
	passwordResetHandler *handlers.PasswordResetHandler,
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
	http.Handle("/swagger/", httpSwagger.WrapHandler)
}
