package services

import (
	"context"
	"io"
)

// FileService определяет интерфейс для работы с файлами
type FileService interface {
	// UploadFile загружает файл в хранилище
	UploadFile(ctx context.Context, file io.Reader, filename string, contentType string) (string, error)
	
	// DownloadFile скачивает файл из хранилища
	DownloadFile(ctx context.Context, filepath string) (io.ReadCloser, error)
	
	// DeleteFile удаляет файл из хранилища
	DeleteFile(ctx context.Context, filepath string) error
	
	// GetFileURL возвращает URL для доступа к файлу
	GetFileURL(ctx context.Context, filepath string) (string, error)
	
	// CheckFileExists проверяет существование файла
	CheckFileExists(ctx context.Context, filepath string) (bool, error)
} 