package cmd

import (
	"io"
	"news-service/internal/cache"
	"news-service/internal/config"
	"news-service/internal/handler"
	"news-service/internal/logger"
	"news-service/internal/repository"
	"news-service/internal/service"
	"os"

	"github.com/gin-gonic/gin"
)

func Run() {
	logger.Init()

	cfg := config.Load()
	logger.Info("Config loaded")

	gin.SetMode(gin.ReleaseMode)
	gin.DefaultWriter = io.Discard
	gin.DefaultErrorWriter = io.Discard

	// PostgreSQL
	repository.InitPostgres(cfg)
	defer repository.DB.Close()

	// Redis
	cache.InitRedis(cfg)
	defer cache.Rdb.Close()

	r := gin.New()
	r.Use(gin.Recovery())

	newsRepo := repository.NewNewsRepo(repository.DB, cache.Rdb)
	newsService := service.NewNewsService(newsRepo)
	handler.RegisterNewsRoutes(r.Group("/news"), newsService)

	if err := r.Run(cfg.HTTPAddr); err != nil {
		logger.Error("failed to run server:", err)
		os.Exit(1)
	}
}
