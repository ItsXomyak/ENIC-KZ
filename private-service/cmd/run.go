package cmd

import (
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"

	"private-service/config"
	_ "private-service/docs"
	"private-service/internal/handlers"
	"private-service/internal/handlers/routes"
	"private-service/internal/logger"
	"private-service/internal/mailer"
	"private-service/internal/metrics"
	"private-service/internal/repository"
	"private-service/internal/services"
)

func Run() {
	logger.Init()
	metrics.InitMetrics()

	go func() {
		logger.Info("Metrics server started on :2112")
		http.Handle("/metrics", promhttp.Handler())
		if err := http.ListenAndServe(":2112", nil); err != nil {
			log.Fatal(err)
		}
	}()

	cfg, err := config.LoadConfig(".")
	if err != nil {
		logger.Error("Error loading config: ", err)
		log.Fatalf("Error loading config: %v", err)
	}

	db, err := repository.NewPostgresDB(cfg)
	if err != nil {
		logger.Error("Error connecting to database: ", err)
		log.Fatalf("Error connecting to database: %v", err)
	}

	userRepo := repository.NewUserRepository(db)
	tokenRepo := repository.NewConfirmationTokenRepository(db)
	passwordResetTokenRepo := repository.NewPasswordResetTokenRepository(db)
	admin2FATokenRepo := repository.NewAdmin2FATokenRepository(db)

	smtpMailer := mailer.NewSMTPMailer(cfg)

	authService := services.NewAuthService(userRepo, tokenRepo, passwordResetTokenRepo, admin2FATokenRepo, cfg, smtpMailer)
	adminService := services.NewAdminService(authService)

	// Создаем root-admin пользователя при запуске
	if err := authService.InitRootAdmin(); err != nil {
		logger.Error("Failed to initialize root admin: ", err)
	}

	authHandler := handlers.NewAuthHandler(authService, cfg)
	confirmHandler := handlers.NewConfirmHandler(authService)
	passwordResetHandler := handlers.NewPasswordResetHandler(authService)
	adminHandler := handlers.NewAdminHandler(adminService)

	routes.RegisterRoutes(authHandler, confirmHandler, passwordResetHandler, adminHandler)

	logger.Info("Server starting on port ", cfg.ServerPort)
	if err := http.ListenAndServe(":"+cfg.ServerPort, nil); err != nil {
		logger.Error("Server failed: ", err)
		log.Fatalf("Server failed: %v", err)
	}
}
