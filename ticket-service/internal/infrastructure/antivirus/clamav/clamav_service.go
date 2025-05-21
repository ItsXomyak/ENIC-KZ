package clamav

import (
	"context"
	"fmt"
	"io"
	"net"
	"os"
	"time"

	"ticket-service/internal/domain/services"
	"ticket-service/internal/logger"
)

const (
	defaultTimeout = 30 * time.Second
	pingCommand    = "PING"
	scanCommand    = "SCAN"
	quitCommand    = "QUIT"
)

type clamavService struct {
	address string
	timeout time.Duration
}

// NewClamAVService создает новый экземпляр сервиса для работы с ClamAV
func NewClamAVService(address string, timeout time.Duration) services.AntivirusService {
	if timeout == 0 {
		timeout = defaultTimeout
	}

	return &clamavService{
		address: address,
		timeout: timeout,
	}
}

func (s *clamavService) ScanFile(ctx context.Context, file io.Reader) (*services.ScanResult, error) {
	logger.Info("Starting file scan via ClamAV")

	conn, err := s.connect()
	if err != nil {
		logger.Error("Failed to connect to ClamAV", "error", err)
		return nil, fmt.Errorf("failed to connect to ClamAV: %w", err)
	}
	defer conn.Close()

	// Отправляем команду SCAN
	if _, err := fmt.Fprintf(conn, "n%s\n", scanCommand); err != nil {
		logger.Error("Failed to send SCAN command", "error", err)
		return nil, fmt.Errorf("failed to send SCAN command: %w", err)
	}

	// Читаем ответ
	response := make([]byte, 1024)
	n, err := conn.Read(response)
	if err != nil {
		logger.Error("Failed to read ClamAV response", "error", err)
		return nil, fmt.Errorf("failed to read ClamAV response: %w", err)
	}

	result := &services.ScanResult{}
	responseStr := string(response[:n])

	// Анализируем ответ
	if responseStr == "OK\n" {
		result.IsInfected = false
	} else {
		result.IsInfected = true
		result.VirusName = responseStr
	}

	logger.Info("File scan completed", "isInfected", result.IsInfected, "virusName", result.VirusName)
	return result, nil
}

func (s *clamavService) ScanFileFromPath(ctx context.Context, filePath string) (*services.ScanResult, error) {
	logger.Info("Starting file scan from path", "filePath", filePath)

	file, err := os.Open(filePath)
	if err != nil {
		logger.Error("Failed to open file", "error", err, "filePath", filePath)
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	return s.ScanFile(ctx, file)
}

func (s *clamavService) IsAvailable(ctx context.Context) bool {
	logger.Info("Checking ClamAV availability")

	conn, err := s.connect()
	if err != nil {
		logger.Error("ClamAV is not available", "error", err)
		return false
	}
	defer conn.Close()

	// Отправляем команду PING
	if _, err := fmt.Fprintf(conn, "n%s\n", pingCommand); err != nil {
		logger.Error("Failed to send PING command", "error", err)
		return false
	}

	// Читаем ответ
	response := make([]byte, 1024)
	n, err := conn.Read(response)
	if err != nil {
		logger.Error("Failed to read PING response", "error", err)
		return false
	}

	isAvailable := string(response[:n]) == "PONG\n"
	logger.Info("ClamAV availability check completed", "isAvailable", isAvailable)
	return isAvailable
}

func (s *clamavService) connect() (net.Conn, error) {
	dialer := net.Dialer{Timeout: s.timeout}
	conn, err := dialer.Dial("tcp", s.address)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to ClamAV: %w", err)
	}

	// Устанавливаем таймаут на операции чтения/записи
	if err := conn.SetDeadline(time.Now().Add(s.timeout)); err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to set connection deadline: %w", err)
	}

	return conn, nil
} 