package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"news-service/internal/config"
	"news-service/internal/logger"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitPostgres(cfg *config.Config) {
	dsn := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=%s",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
		cfg.DBSSL,
	)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		logger.Error("Unable to connect to database: ", err)
	}

	if err := pool.Ping(ctx); err != nil {
		logger.Error("Unable to ping database: ", err)
	}

	log.Println("Connected to PostgreSQL")
	DB = pool
}
