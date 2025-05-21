package s3

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"

	"ticket-service/internal/domain/services"
	"ticket-service/internal/logger"
)

type s3Service struct {
	client     *minio.Client
	bucketName string
	location   string
}

// NewS3Service создает новый экземпляр сервиса для работы с S3
func NewS3Service(cfg *Config) (services.FileService, error) {
	logger.Info("Initializing S3 service", "endpoint", cfg.Endpoint, "bucket", cfg.BucketName)

	// Инициализация клиента MinIO
	client, err := minio.New(cfg.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
		Secure: cfg.UseSSL,
	})
	if err != nil {
		logger.Error("Failed to create S3 client", "error", err)
		return nil, fmt.Errorf("%w: %v", ErrConnectionFailed, err)
	}

	// Проверяем существование бакета
	exists, err := client.BucketExists(context.Background(), cfg.BucketName)
	if err != nil {
		logger.Error("Failed to check bucket existence", "bucket", cfg.BucketName, "error", err)
		return nil, fmt.Errorf("%w: %v", ErrConnectionFailed, err)
	}

	// Если бакет не существует, создаем его
	if !exists {
		logger.Info("Creating new bucket", "bucket", cfg.BucketName)
		err = client.MakeBucket(context.Background(), cfg.BucketName, minio.MakeBucketOptions{
			Region: cfg.Region,
		})
		if err != nil {
			logger.Error("Failed to create bucket", "bucket", cfg.BucketName, "error", err)
			return nil, fmt.Errorf("%w: %v", ErrBucketNotFound, err)
		}
		logger.Info("Bucket created successfully", "bucket", cfg.BucketName)
	}

	logger.Info("S3 service initialized successfully", "bucket", cfg.BucketName)
	return &s3Service{
		client:     client,
		bucketName: cfg.BucketName,
		location:   cfg.Region,
	}, nil
}

func (s *s3Service) UploadFile(ctx context.Context, file io.Reader, filename string, contentType string) (string, error) {
	logger.Info("Starting file upload", "filename", filename, "contentType", contentType)

	// Проверяем размер файла
	fileSize, err := getFileSize(file)
	if err != nil {
		logger.Error("Failed to get file size", "filename", filename, "error", err)
		return "", fmt.Errorf("failed to get file size: %w", err)
	}

	if fileSize > MaxFileSize {
		logger.Warn("File too large", "filename", filename, "size", fileSize, "maxSize", MaxFileSize)
		return "", ErrFileTooLarge
	}

	// Генерируем уникальное имя файла
	objectName := fmt.Sprintf("%d/%s", time.Now().UnixNano(), filename)
	logger.Info("Generated object name", "objectName", objectName)

	// Загружаем файл
	_, err = s.client.PutObject(ctx, s.bucketName, objectName, file, fileSize, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		logger.Error("Failed to upload file", "objectName", objectName, "error", err)
		return "", fmt.Errorf("%w: %v", ErrUploadFailed, err)
	}

	logger.Info("File uploaded successfully", "objectName", objectName, "size", fileSize)
	return objectName, nil
}

func (s *s3Service) DownloadFile(ctx context.Context, filepath string) (io.ReadCloser, error) {
	logger.Info("Starting file download", "filepath", filepath)

	// Проверяем существование файла
	exists, err := s.CheckFileExists(ctx, filepath)
	if err != nil {
		logger.Error("Failed to check file existence", "filepath", filepath, "error", err)
		return nil, fmt.Errorf("failed to check file existence: %w", err)
	}
	if !exists {
		logger.Warn("File not found", "filepath", filepath)
		return nil, ErrFileNotFound
	}

	object, err := s.client.GetObject(ctx, s.bucketName, filepath, minio.GetObjectOptions{})
	if err != nil {
		logger.Error("Failed to download file", "filepath", filepath, "error", err)
		return nil, fmt.Errorf("%w: %v", ErrDownloadFailed, err)
	}

	logger.Info("File download started", "filepath", filepath)
	return object, nil
}

func (s *s3Service) DeleteFile(ctx context.Context, filepath string) error {
	logger.Info("Starting file deletion", "filepath", filepath)

	// Проверяем существование файла
	exists, err := s.CheckFileExists(ctx, filepath)
	if err != nil {
		logger.Error("Failed to check file existence", "filepath", filepath, "error", err)
		return fmt.Errorf("failed to check file existence: %w", err)
	}
	if !exists {
		logger.Warn("File not found for deletion", "filepath", filepath)
		return ErrFileNotFound
	}

	err = s.client.RemoveObject(ctx, s.bucketName, filepath, minio.RemoveObjectOptions{})
	if err != nil {
		logger.Error("Failed to delete file", "filepath", filepath, "error", err)
		return fmt.Errorf("%w: %v", ErrDeleteFailed, err)
	}

	logger.Info("File deleted successfully", "filepath", filepath)
	return nil
}

func (s *s3Service) GetFileURL(ctx context.Context, filepath string) (string, error) {
	logger.Info("Generating file URL", "filepath", filepath)

	// Проверяем существование файла
	exists, err := s.CheckFileExists(ctx, filepath)
	if err != nil {
		logger.Error("Failed to check file existence", "filepath", filepath, "error", err)
		return "", fmt.Errorf("failed to check file existence: %w", err)
	}
	if !exists {
		logger.Warn("File not found for URL generation", "filepath", filepath)
		return "", ErrFileNotFound
	}

	// Генерируем URL для доступа к файлу
	reqParams := url.Values{}
	presignedURL, err := s.client.PresignedGetObject(ctx, s.bucketName, filepath, time.Hour*24, reqParams)
	if err != nil {
		logger.Error("Failed to generate URL", "filepath", filepath, "error", err)
		return "", fmt.Errorf("%w: %v", ErrURLGenerationFailed, err)
	}

	logger.Info("URL generated successfully", "filepath", filepath)
	return presignedURL.String(), nil
}

func (s *s3Service) CheckFileExists(ctx context.Context, filepath string) (bool, error) {
	_, err := s.client.StatObject(ctx, s.bucketName, filepath, minio.StatObjectOptions{})
	if err != nil {
		if minio.ToErrorResponse(err).Code == "NoSuchKey" {
			return false, nil
		}
		logger.Error("Failed to check file existence", "filepath", filepath, "error", err)
		return false, fmt.Errorf("failed to check file existence: %w", err)
	}

	return true, nil
}

// getFileSize возвращает размер файла
func getFileSize(reader io.Reader) (int64, error) {
	// Создаем ограниченный ридер для проверки размера
	limitedReader := io.LimitReader(reader, MaxFileSize+1)

	// Читаем весь файл для подсчета размера
	size, err := io.Copy(io.Discard, limitedReader)
	if err != nil {
		return 0, fmt.Errorf("failed to read file: %w", err)
	}

	// Если размер больше максимального, возвращаем ошибку
	if size > MaxFileSize {
		return 0, ErrFileTooLarge
	}

	return size, nil
} 