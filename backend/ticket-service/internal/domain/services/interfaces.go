package services

import (
	"context"
	"io"
)

// IFileService определяет интерфейс для работы с файлами
type IFileService interface {
	// UploadFile загружает файл в хранилище
	UploadFile(ctx context.Context, file io.Reader, folder string, id string) (string, error)
	
	// DownloadFile скачивает файл из хранилища
	DownloadFile(ctx context.Context, filepath string) (io.ReadCloser, error)
	
	// DeleteFile удаляет файл из хранилища
	DeleteFile(ctx context.Context, filepath string) error
	
	// GetFileURL возвращает URL для доступа к файлу
	GetFileURL(ctx context.Context, filepath string) (string, error)
	
	// CheckFileExists проверяет существование файла
	CheckFileExists(ctx context.Context, filepath string) (bool, error)
}

// IEmailService определяет интерфейс для отправки email
type IEmailService interface {
	SendTicketResponseNotification(to, ticketSubject, responseMessage string) error
}

// IAntivirusService определяет интерфейс для проверки файлов
type IAntivirusService interface {
	ScanFile(ctx context.Context, file io.Reader) (bool, error)
	ScanFileFromPath(ctx context.Context, filePath string) (bool, error)
	IsAvailable(ctx context.Context) bool
} 