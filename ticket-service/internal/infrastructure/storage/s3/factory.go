package s3

import (
	"ticket-service/internal/config"
	"ticket-service/internal/domain/services"
)

// Factory создает и возвращает новый экземпляр S3 сервиса
func Factory(cfg *config.Config) (services.IFileService, error) {
	s3Config := NewConfig(
		cfg.S3.Endpoint,
		cfg.S3.AccessKeyID,
		cfg.S3.SecretAccessKey,
		cfg.S3.BucketName,
		cfg.S3.Region,
		cfg.S3.UseSSL,
	)
	return NewS3Service(s3Config)
} 