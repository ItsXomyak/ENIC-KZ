package services

import (
	"context"
	"io"
)

// IFileService определяет интерфейс для работы с файлами
type IFileService interface {
	UploadFile(ctx context.Context, file io.Reader, folder string, id string) (string, error)
	DeleteFile(ctx context.Context, fileURL string) error
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