package routes

import (
	"net/http"

	httpSwagger "github.com/swaggo/http-swagger"

	_ "auth-service/docs"
	"auth-service/internal/api/handlers"
)

func RegisterRoutes(
	authHandler *handlers.AuthHandler,
	confirmHandler *handlers.ConfirmHandler,
	passwordResetHandler *handlers.PasswordResetHandler,
	profileHandler *handlers.ProfileHandler,
	metricsHandler *handlers.MetricsHandler,
) http.Handler {
	mux := http.NewServeMux()

	//metrics
	mux.HandleFunc("/metrics", metricsHandler.HandleMetrics)

	// Swagger UI
	mux.HandleFunc("/swagger/", httpSwagger.WrapHandler)

	// Auth routes
	mux.HandleFunc("/api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("/api/v1/auth/login", authHandler.Login)
	mux.HandleFunc("/api/v1/auth/logout", authHandler.Logout)
	mux.HandleFunc("/api/v1/auth/refresh", authHandler.RefreshToken)
	mux.HandleFunc("/api/v1/auth/confirm", confirmHandler.ConfirmEmail)
	mux.HandleFunc("/api/v1/auth/reset-password", passwordResetHandler.RequestPasswordReset)
	mux.HandleFunc("/api/v1/auth/reset-password/confirm", passwordResetHandler.ResetPassword)

	// Profile routes (защищенные)
	mux.HandleFunc("/api/v1/profile", profileHandler.GetProfile)
	mux.HandleFunc("/api/v1/profile/update", profileHandler.UpdateProfile)

	return mux
}
