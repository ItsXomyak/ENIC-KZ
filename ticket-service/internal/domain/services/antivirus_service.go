package services

import (
	"context"
	"io"
)

// ScanResult представляет результат проверки файла
type ScanResult struct {
	IsInfected bool   // Файл заражен
	VirusName  string // Название вируса, если файл заражен
	Error      error  // Ошибка при сканировании
}

// AntivirusService определяет интерфейс для работы с антивирусом
type AntivirusService interface {
	// ScanFile проверяет файл на наличие вирусов
	ScanFile(ctx context.Context, file io.Reader) (*ScanResult, error)
	
	// ScanFileFromPath проверяет файл по пути
	ScanFileFromPath(ctx context.Context, filePath string) (*ScanResult, error)
	
	// IsAvailable проверяет доступность антивирусного сервиса
	IsAvailable(ctx context.Context) bool
} 