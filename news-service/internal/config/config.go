package config

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	HTTPAddr   string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSL      string
	RedisAddr  string
	RedisPwd   string
	RedisDB    int
}

func Load() *Config {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := viper.ReadInConfig(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	cfg := &Config{
		HTTPAddr:   viper.GetString("HTTP_ADDR"),
		DBHost:     viper.GetString("DB_HOST"),
		DBPort:     viper.GetString("DB_PORT"),
		DBUser:     viper.GetString("DB_USER"),
		DBPassword: viper.GetString("DB_PASSWORD"),
		DBName:     viper.GetString("DB_NAME"),
		DBSSL:      viper.GetString("DB_SSL"),
		RedisAddr:  viper.GetString("REDIS_ADDR"),
		RedisPwd:   viper.GetString("REDIS_PASSWORD"),
		RedisDB:    viper.GetInt("REDIS_DB"),
	}

	return cfg
}
