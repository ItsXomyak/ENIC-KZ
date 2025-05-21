package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	S3       S3Config       `mapstructure:"s3"`
	ClamAV   ClamAVConfig   `mapstructure:"clamav"`
	Captcha  CaptchaConfig  `mapstructure:"captcha"`
	Auth     AuthConfig     `mapstructure:"auth"`
}

type ServerConfig struct {
	Port            string        `mapstructure:"port"`
	ShutdownTimeout time.Duration `mapstructure:"shutdown_timeout"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type S3Config struct {
	Endpoint        string `mapstructure:"endpoint"`
	AccessKeyID     string `mapstructure:"access_key_id"`
	SecretAccessKey string `mapstructure:"secret_access_key"`
	BucketName      string `mapstructure:"bucket_name"`
	Region          string `mapstructure:"region"`
	UseSSL          bool   `mapstructure:"use_ssl"`
}

type ClamAVConfig struct {
	Host string `mapstructure:"host"`
	Port string `mapstructure:"port"`
}

type CaptchaConfig struct {
	SecretKey string  `mapstructure:"secret_key"`
	MinScore  float64 `mapstructure:"min_score"`
}

type AuthConfig struct {
	JWTSecret string `mapstructure:"jwt_secret"`
}

func LoadConfig(path string) (*Config, error) {
	viper.SetConfigFile(path)
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("error reading config file: %w", err)
	}

	config := &Config{}
	if err := viper.Unmarshal(config); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
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
	return fmt.Sprintf("%s:%s", c.ClamAV.Host, c.ClamAV.Port)
}

type ClamAV struct {
	Address string        `yaml:"address"`
	Timeout time.Duration `yaml:"timeout"`
}

// GetS3Config возвращает конфигурацию S3
func (c *Config) GetS3Config() S3Config {
	return c.S3
}
