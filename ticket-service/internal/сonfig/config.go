package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
    DBURL           string
    RedisURL        string
    S3AccessKey     string
    S3SecretKey     string
    S3Region        string
    S3Bucket        string
    AuthServiceURL  string
    Port            string
}

func Load() *Config {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    return &Config{
        DBURL:           os.Getenv("DB_URL"),
        RedisURL:        os.Getenv("REDIS_URL"),
        S3AccessKey:     os.Getenv("S3_ACCESS_KEY"),
        S3SecretKey:     os.Getenv("S3_SECRET_KEY"),
        S3Region:        os.Getenv("S3_REGION"),
        S3Bucket:        os.Getenv("S3_BUCKET"),
        AuthServiceURL:  os.Getenv("AUTH_SERVICE_URL"),
        Port:            os.Getenv("PORT"),
    }
}	