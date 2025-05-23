package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// Config holds service configuration loaded from environment or .env file.
type Config struct {
	ServicePort string // port for the service
	HTTPAddr    string // HTTP listen address

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSL      string

	RedisAddr string
	RedisPwd  string
	RedisDB   int
}

func Load() *Config {
	viper.SetConfigType("env")
	viper.AutomaticEnv()

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	port := viper.GetString("SERVICE_PORT")
	if port == "" {
		port = "8081"
	}

	httpAddr := fmt.Sprintf(":%s", port)

	host := viper.GetString("REDIS_HOST")
	if host == "" {
		host = "localhost"
	}
	portR := viper.GetString("REDIS_PORT")
	if portR == "" {
		portR = "6379"
	}
	r := fmt.Sprintf("%s:%s", host, portR)

	return &Config{
		ServicePort: port,
		HTTPAddr:    httpAddr,

		DBHost:     viper.GetString("DB_HOST"),
		DBPort:     viper.GetString("DB_PORT"),
		DBUser:     viper.GetString("DB_USER"),
		DBPassword: viper.GetString("DB_PASSWORD"),
		DBName:     viper.GetString("DB_NAME"),
		DBSSL:      viper.GetString("DB_SSL"),

		RedisAddr: r,
		RedisPwd:  viper.GetString("REDIS_PASSWORD"),
		RedisDB:   viper.GetInt("REDIS_DB"),
	}
}
