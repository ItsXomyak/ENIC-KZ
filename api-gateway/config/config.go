package config

import "os"

type ServiceConfig struct {
	Host string
	Port string
}

type Config struct {
	AuthService   ServiceConfig
	NewsService   ServiceConfig
	TicketService ServiceConfig
}

func LoadConfig() *Config {
	return &Config{
		AuthService: ServiceConfig{
			Host: getEnv("AUTH_SERVICE_HOST", "localhost"),
			Port: getEnv("AUTH_SERVICE_PORT", "8080"),
		},
		NewsService: ServiceConfig{
			Host: getEnv("NEWS_SERVICE_HOST", "localhost"),
			Port: getEnv("NEWS_SERVICE_PORT", "8081"),
		},
		TicketService: ServiceConfig{
			Host: getEnv("TICKET_SERVICE_HOST", "localhost"),
			Port: getEnv("TICKET_SERVICE_PORT", "8082"),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
