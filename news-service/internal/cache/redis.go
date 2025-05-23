package cache

import (
	"context"
	"time"

	"news-service/internal/config"
	"news-service/internal/logger"

	"github.com/go-redis/redis/v8"
)

var Rdb *redis.Client

func InitRedis(cfg *config.Config) {
	Rdb = redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPwd,
		DB:       cfg.RedisDB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := Rdb.Ping(ctx).Err(); err != nil {
		logger.Error("failed to connect to Redis:", err)
		return
	}

	logger.Info("connected to Redis at ", cfg.RedisAddr)
}
