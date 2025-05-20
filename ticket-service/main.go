package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"

	"ticket-service/api/handlers"
	"ticket-service/api/middleware"
	"ticket-service/config"
	"ticket-service/logger"
	"ticket-service/repositories"
	"ticket-service/services/ticket"
)

func main() {
	// Инициализация логгера
	logger.Init()

	// Инициализация конфигурации
	cfg, err := config.Load()
	if err != nil {
		logger.Error("Failed to load config:", err)
		return
	}

	// Инициализация БД
	db, err := repositories.NewPostgresDB(cfg)
	if err != nil {
		logger.Error("Failed to connect to PostgreSQL:", err)
		return
	}
	defer db.Close()

	// Инициализация Redis
	redisClient, err := repositories.NewRedisClient(cfg)
	if err != nil {
		logger.Error("Failed to connect to Redis:", err)
		return
	}
	defer redisClient.Close()

	// Инициализация сервисов
	ticketService, err := ticket.NewService(db, redisClient, cfg)
	if err != nil {
		logger.Error("Failed to initialize ticket service:", err)
		return
	}

	// Запуск воркера для обработки уведомлений
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go ticketService.ProcessNotifications(ctx)

	// Инициализация роутера Gin
	r := gin.Default()

	// Middleware
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.JWTAuthMiddleware(cfg))
	r.Use(middleware.ReCAPTCHAMiddleware(cfg))

	// Эндпоинты
	api := r.Group("/api")
	{
		tickets := api.Group("/tickets")
		{
			tickets.POST("", handlers.CreateTicket(ticketService))
			tickets.GET(":id", handlers.GetTicket(ticketService))
			tickets.GET("", handlers.ListTickets(ticketService))
			tickets.PATCH(":id/status", middleware.AdminOnly(), handlers.UpdateTicketStatus(ticketService))
		}
	}

	// Запуск сервера
	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	logger.Info("Starting server on", addr)
	if err := r.Run(addr); err != nil {
		logger.Error("Failed to start server:", err)
	}
}