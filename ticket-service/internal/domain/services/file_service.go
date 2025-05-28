package services

import (
	"context"
	"io"
	"path/filepath"
	"strings"

	"github.com/minio/minio-go/v7"
)

// MinioFileService реализует IFileService для работы с MinIO
type MinioFileService struct {
	client     *minio.Client
	bucketName string
}

// NewMinioFileService создает новый экземпляр MinioFileService
func NewMinioFileService(client *minio.Client, bucketName string) *MinioFileService {
	return &MinioFileService{
		client:     client,
		bucketName: bucketName,
	}
}

// UploadFile загружает файл в MinIO
func (s *MinioFileService) UploadFile(ctx context.Context, file io.Reader, folder string, id string) (string, error) {
	objectName := filepath.Join(folder, id)
	_, err := s.client.PutObject(ctx, s.bucketName, objectName, file, -1, minio.PutObjectOptions{})
	if err != nil {
		return "", err
	}
	return objectName, nil
}

// DownloadFile скачивает файл из MinIO
func (s *MinioFileService) DownloadFile(ctx context.Context, filepath string) (io.ReadCloser, error) {
	object, err := s.client.GetObject(ctx, s.bucketName, filepath, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	return object, nil
}

// DeleteFile удаляет файл из MinIO
func (s *MinioFileService) DeleteFile(ctx context.Context, filepath string) error {
	return s.client.RemoveObject(ctx, s.bucketName, filepath, minio.RemoveObjectOptions{})
}

// GetFileURL возвращает URL для доступа к файлу
func (s *MinioFileService) GetFileURL(ctx context.Context, filepath string) (string, error) {
	// В реальном приложении здесь может быть генерация пресайн URL
	return filepath, nil
}

// CheckFileExists проверяет существование файла в MinIO
func (s *MinioFileService) CheckFileExists(ctx context.Context, filepath string) (bool, error) {
	_, err := s.client.StatObject(ctx, s.bucketName, filepath, minio.StatObjectOptions{})
	if err != nil {
		if strings.Contains(err.Error(), "does not exist") {
			return false, nil
		}
		return false, err
	}
	return true, nil
} 