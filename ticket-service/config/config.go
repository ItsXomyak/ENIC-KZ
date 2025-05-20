package config

import (
	"github.com/spf13/viper"

	"ticket-service/logger"
)

type Config struct {
	ServerPort        string `mapstructure:"SERVER_PORT"`
	PostgresDSN       string `mapstructure:"POSTGRES_DSN"`
	RedisAddr         string `mapstructure:"REDIS_ADDR"`
	RedisPassword     string `mapstructure:"REDIS_PASSWORD"`
	S3Bucket          string `mapstructure:"S3_BUCKET"`
	S3Region          string `mapstructure:"S3_REGION"`
	AWSAccessKeyID    string `mapstructure:"AWS_ACCESS_KEY_ID"`
	AWSSecretAccessKey string `mapstructure:"AWS_SECRET_ACCESS_KEY"`
	SMTPHost          string `mapstructure:"SMTP_HOST"`
	SMTPPort          int    `mapstructure:"SMTP_PORT"`
	SMTPUser          string `mapstructure:"SMTP_USER"`
	SMTPPass          string `mapstructure:"SMTP_PASS"`
	ReCAPTCHASecret   string `mapstructure:"RECAPTCHA_SECRET"`
	JWTSecret         string `mapstructure:"JWT_SECRET"`
	ClamAVAddr        string `mapstructure:"CLAMAV_ADDR"`
}

func Load() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AutomaticEnv()

	if err := v.ReadInConfig(); err != nil {
		logger.Error("Failed to read config file:", err)
		return nil, err
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		logger.Error("Failed to unmarshal config:", err)
		return nil, err
	}

	return &cfg, nil
}