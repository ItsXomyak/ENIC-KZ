package cmd

import (
	"log"
	"net/http"

	"authforge/config"
	_ "authforge/docs"
	"authforge/internal/handlers"
	"authforge/internal/handlers/routes"
	"authforge/internal/logger"
	"authforge/internal/mailer"
	"authforge/internal/metrics"
	"authforge/internal/repository"
	"authforge/internal/services"

	"github.com/prometheus/client_golang/prometheus/promhttp"
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

	authHandler := handlers.NewAuthHandler(authService, cfg)
	confirmHandler := handlers.NewConfirmHandler(authService)
	passwordResetHandler := handlers.NewPasswordResetHandler(authService)

	routes.RegisterRoutes(authHandler, confirmHandler, passwordResetHandler)

	logger.Info("Server starting on port ", cfg.ServerPort)
	if err := http.ListenAndServe(":"+cfg.ServerPort, nil); err != nil {
		logger.Error("Server failed: ", err)
		log.Fatalf("Server failed: %v", err)
	}
}
