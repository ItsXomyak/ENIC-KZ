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

	"ticket-service/internal/config"
	"ticket-service/internal/delivery/http/handlers"
	"ticket-service/internal/delivery/http/router"
	"ticket-service/internal/domain/services"
	"ticket-service/internal/infrastructure/antivirus/clamav"
	"ticket-service/internal/infrastructure/database/postgres"
	"ticket-service/internal/infrastructure/storage/s3"
	"ticket-service/internal/logger"
)

func main() {
	// Инициализация конфигурации
	cfg, err := config.LoadConfig("config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Инициализация логгера
	logger.Init()

	// Инициализация подключения к базе данных
	pool, err := pgxpool.New(context.Background(), cfg.GetDSN())
	if err != nil {
		logger.Error("Failed to connect to database", "error", err)
	}
	defer pool.Close()

	// Инициализация S3 клиента
	fileService, err := s3.Factory(cfg)
	if err != nil {
		logger.Error("Failed to initialize S3 client", "error", err)
	}

	// Инициализация ClamAV
	clamavService := clamav.NewClamAVService(cfg.GetClamAVAddr(), 30*time.Second)

	// Инициализация репозиториев
	ticketRepo := postgres.NewTicketRepository(pool)
	historyRepo := postgres.NewHistoryRepository(pool)
	responseRepo := postgres.NewResponseRepository(pool)

	// Инициализация сервисов
	ticketService := services.NewTicketService(ticketRepo, historyRepo, responseRepo, clamavService, fileService)
	responseService := services.NewResponseService(responseRepo)

	// Инициализация обработчиков
	ticketHandler := handlers.NewTicketHandler(ticketService)
	responseHandler := handlers.NewResponseHandler(responseService)

	// Инициализация роутера
	r := router.SetupRouter(ticketHandler, responseHandler)

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