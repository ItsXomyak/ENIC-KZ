package cache

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"

	"ticket-service/internal/config"
	"ticket-service/internal/logger"
)

// NewRedisClient создает новый клиент Redis
func NewRedisClient(cfg *config.Config) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.GetRedisAddr(),
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})

	// Проверяем подключение
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	logger.Info("Successfully connected to Redis")
	return client, nil
} 