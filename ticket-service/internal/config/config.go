package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	S3       S3Config
	ClamAV   ClamAVConfig
	Captcha  CaptchaConfig
	Auth     AuthConfig
}

type ServerConfig struct {
	Port            string
	ShutdownTimeout time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type S3Config struct {
	Endpoint        string
	AccessKeyID     string
	SecretAccessKey string
	BucketName      string
	Region          string
	UseSSL          bool
}

type ClamAVConfig struct {
	Address string
	Timeout time.Duration
}

type CaptchaConfig struct {
	SecretKey string
	MinScore  float64
}

type AuthConfig struct {
	JWTSecret string
}

func LoadConfig() (*Config, error) {
	v := viper.New()
	v.AutomaticEnv()

	config := &Config{
		Server: ServerConfig{
			Port:            v.GetString("SERVER_PORT"),
			ShutdownTimeout: v.GetDuration("SERVER_SHUTDOWN_TIMEOUT"),
		},
		Database: DatabaseConfig{
			Host:     v.GetString("DB_HOST"),
			Port:     v.GetString("DB_PORT"),
			User:     v.GetString("DB_USER"),
			Password: v.GetString("DB_PASSWORD"),
			DBName:   v.GetString("DB_NAME"),
			SSLMode:  v.GetString("DB_SSLMODE"),
		},
		Redis: RedisConfig{
			Host:     v.GetString("REDIS_HOST"),
			Port:     v.GetString("REDIS_PORT"),
			Password: v.GetString("REDIS_PASSWORD"),
			DB:       v.GetInt("REDIS_DB"),
		},
		S3: S3Config{
			Endpoint:        v.GetString("S3_ENDPOINT"),
			AccessKeyID:     v.GetString("S3_ACCESS_KEY_ID"),
			SecretAccessKey: v.GetString("S3_SECRET_ACCESS_KEY"),
			BucketName:      v.GetString("S3_BUCKET_NAME"),
			Region:          v.GetString("S3_REGION"),
			UseSSL:          v.GetBool("S3_USE_SSL"),
		},
		ClamAV: ClamAVConfig{
			Address: fmt.Sprintf("%s:%s", v.GetString("CLAMAV_HOST"), v.GetString("CLAMAV_PORT")),
			Timeout: v.GetDuration("CLAMAV_TIMEOUT"),
		},
		Captcha: CaptchaConfig{
			SecretKey: v.GetString("CAPTCHA_SECRET_KEY"),
			MinScore:  v.GetFloat64("CAPTCHA_MIN_SCORE"),
		},
		Auth: AuthConfig{
			JWTSecret: v.GetString("JWT_SECRET"),
		},
	}

	return config, nil
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.DBName,
		c.Database.SSLMode,
	)
}

func (c *Config) GetRedisAddr() string {
	return fmt.Sprintf("%s:%s", c.Redis.Host, c.Redis.Port)
}

func (c *Config) GetClamAVAddr() string {
	return c.ClamAV.Address
}

func (c *Config) GetS3Config() S3Config {
	return c.S3
}
