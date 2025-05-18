package main

import (
	"context"

	"ticket-service/internal/clients/auth"
	"ticket-service/internal/config"
	"ticket-service/internal/handlers"
	"ticket-service/internal/logger"
	"ticket-service/internal/middleware"
	"ticket-service/internal/repository"
	"ticket-service/internal/services"
	"ticket-service/internal/storage"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
)

func main() {
    cfg := config.Load()
    log := logger.New()

    // Database
    db, err := pgx.Connect(context.Background(), cfg.DBURL)
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }
    defer db.Close(context.Background())

    // Redis
    redisClient := redis.NewClient(&redis.Options{Addr: cfg.RedisURL})
    queueClient := asynq.NewClient(asynq.RedisClientOpt{Addr: cfg.RedisURL})

    // S3
    s3Storage, err := storage.NewS3Storage(cfg)
    if err != nil {
        log.Fatal("Failed to initialize S3: ", err)
    }

    // Repositories
    ticketRepo := repository.NewTicketRepository(db)

    // Services
    ticketService := services.NewTicketService(ticketRepo, s3Storage, queueClient)

    // Handlers
    ticketHandler := handlers.NewTicketHandler(ticketService)

    // Auth client
    authClient := auth.NewClient(cfg.AuthServiceURL)

    // Router
    r := gin.Default()
    r.Use(middleware.Auth(authClient))

    // Public routes
    r.POST("/tickets", ticketHandler.CreateTicket)
    r.GET("/tickets", ticketHandler.GetUserTickets)
    r.GET("/tickets/:id", ticketHandler.GetTicket)
    r.POST("/tickets/:id/attachments", ticketHandler.AddAttachment)
    r.POST("/tickets/:id/messages", ticketHandler.AddMessage)

    // Admin routes
    admin := r.Group("/admin").Use(middleware.AdminOnly(authClient))
    admin.PATCH("/tickets/:id/status", ticketHandler.UpdateTicketStatus)

    // Prometheus
    r.GET("/metrics", gin.WrapH(promhttp.Handler()))

    // Start server
    log.Info("Starting ticket-service on port ", cfg.Port)
    if err := r.Run(":" + cfg.Port); err != nil {
        log.Fatal("Failed to start server: ", err)
    }
}