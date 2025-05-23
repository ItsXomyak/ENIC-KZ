package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	_ "ticket-service/docs" // Import Swagger docs
	"ticket-service/internal/config"
	"ticket-service/internal/delivery/http/handlers"
	"ticket-service/internal/delivery/http/router"
	"ticket-service/internal/domain/services"
	"ticket-service/internal/infrastructure/antivirus/clamav"
	"ticket-service/internal/infrastructure/cache"
	"ticket-service/internal/infrastructure/database/postgres"
	"ticket-service/internal/infrastructure/notification/email"
	"ticket-service/internal/infrastructure/storage/s3"
	"ticket-service/internal/logger"
)

// @title Ticket Service API
// @version 1.0
// @description API for managing support tickets and responses
// @host localhost:8080
// @BasePath /api/v1
// @contact.name ENIC-KZ Support
// @contact.email support@enic.kz
// @schemes http https
func main() {
	// Инициализация конфигурации
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Инициализация логгера
	logger.Init()

	// Инициализация подключения к базе данных
	pool, err := pgxpool.New(context.Background(), cfg.GetDSN())
	if err != nil {
		logger.Error("Failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

	// Инициализация Redis
	redisClient, err := cache.NewRedisClient(cfg)
	if err != nil {
		logger.Error("Failed to connect to Redis", "error", err)
		os.Exit(1)
	}
	defer redisClient.Close()

	// Инициализация S3 клиента
	fileService, err := s3.Factory(cfg)
	if err != nil {
		logger.Error("Failed to initialize S3 client", "error", err)
		os.Exit(1)
	}

	// Инициализация ClamAV
	clamavService := clamav.NewClamAVService(cfg.GetClamAVAddr(), 30*time.Second)
	if clamavService == nil {
		logger.Error("Failed to initialize ClamAV service")
		os.Exit(1)
	}

	// Инициализация email сервиса
	emailService := email.NewEmailService()
	if emailService == nil {
		logger.Error("Failed to initialize email service")
		os.Exit(1)
	}

	// Инициализация репозиториев
	ticketRepo := postgres.NewTicketRepository(pool)
	historyRepo := postgres.NewHistoryRepository(pool)
	responseRepo := postgres.NewResponseRepository(pool)

	// Проверка инициализации репозиториев
	if ticketRepo == nil || historyRepo == nil || responseRepo == nil {
		logger.Error("Failed to initialize repositories")
		os.Exit(1)
	}

	// Инициализация сервисов
	ticketService := services.NewTicketService(ticketRepo, historyRepo, responseRepo, clamavService, fileService)
	if ticketService == nil {
		logger.Error("Failed to initialize ticket service")
		os.Exit(1)
	}

	responseService := services.NewResponseService(responseRepo, ticketRepo, fileService, emailService)
	if responseService == nil {
		logger.Error("Failed to initialize response service")
		os.Exit(1)
	}

	// Инициализация обработчиков
	ticketHandler := handlers.NewTicketHandler(ticketService)
	responseHandler := handlers.NewResponseHandler(responseService)

	// Проверка инициализации обработчиков
	if ticketHandler == nil || responseHandler == nil {
		logger.Error("Failed to initialize handlers")
		os.Exit(1)
	}

	// Инициализация роутера
	r := router.SetupRouter(ticketHandler, responseHandler, redisClient)
	if r == nil {
		logger.Error("Failed to setup router")
		os.Exit(1)
	}

	// Создание HTTP сервера
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Server.Port),
		Handler: r,
	}

	// Запуск сервера в горутине
	go func() {
		logger.Info("Starting server", "port", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Failed to start server", "error", err)
		}
	}()

	// Ожидание сигнала для graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Graceful shutdown
	logger.Info("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown", "error", err)
	}

	logger.Info("Server exiting")
}
