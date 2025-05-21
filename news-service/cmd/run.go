package cmd

import (
	"news-service/internal/cache"
	"news-service/internal/config"
	"news-service/internal/logger"
	"news-service/internal/repository"
	"os"

	"github.com/gin-gonic/gin"
)

func Run() {
	logger.Init()

	cfg := config.Load()
	logger.Info("Config loaded")

	// PostgreSQL
	repository.InitPostgres(cfg)
	defer repository.DB.Close()

	// Redis
	cache.InitRedis(cfg)
	defer cache.Rdb.Close()

	r := gin.Default()

	// TODO: маршруты

	if err := r.Run(cfg.HTTPAddr); err != nil {
		logger.Error("failed to run server:", err)
		os.Exit(1)
	}
}
