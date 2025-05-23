package services

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"
	"ticket-service/internal/logger"
)

// Определяем пользовательские ошибки
var (
	ErrAntivirusNotAvailable = errors.New("antivirus service is not available")
	ErrFileRequired          = errors.New("file name and type are required when file is provided")
	ErrFileContainsMalware   = errors.New("file contains malware")
)

type TicketService struct {
	ticketRepo      repositories.TicketRepository
	historyRepo     repositories.TicketHistoryRepository
	responseRepo    repositories.ResponseRepository
	antivirusService IAntivirusService
	fileService     IFileService
}

func NewTicketService(
	ticketRepo repositories.TicketRepository,
	historyRepo repositories.TicketHistoryRepository,
	responseRepo repositories.ResponseRepository,
	antivirusService IAntivirusService,
	fileService IFileService,
) *TicketService {
	return &TicketService{
		ticketRepo:      ticketRepo,
		historyRepo:     historyRepo,
		responseRepo:    responseRepo,
		antivirusService: antivirusService,
		fileService:     fileService,
	}
}

func (s *TicketService) CreateTicket(ctx context.Context, ticket *models.Ticket, fileReader io.Reader) error {
	logger.Info("Creating new ticket", "userID", ticket.UserID, "subject", ticket.Subject)

	if s.antivirusService == nil {
		logger.Error("ClamAV is not available")
		return ErrAntivirusNotAvailable
	}

	if fileReader != nil {
		if ticket.FileName == nil || ticket.FileType == nil {
			return ErrFileRequired
		}

		// Буферизуем файл для возможности повторного чтения
		buf := new(bytes.Buffer)
		if _, err := io.Copy(buf, fileReader); err != nil {
			logger.Error("Failed to buffer file", "error", err, "filename", *ticket.FileName)
			return fmt.Errorf("failed to buffer file: %w", err)
		}

		// Создаем bytes.Reader для поддержки Seek
		reader := bytes.NewReader(buf.Bytes())

		// Сканируем файл
		isClean, err := s.antivirusService.ScanFile(ctx, reader)
		if err != nil {
			logger.Error("Failed to scan file", "error", err, "filename", *ticket.FileName)
			return fmt.Errorf("failed to scan file: %w", err)
		}

		if !isClean {
			logger.Error("File contains malware", "filename", *ticket.FileName)
			return ErrFileContainsMalware
		}

		// Сбрасываем позицию чтения
		if _, err := reader.Seek(0, io.SeekStart); err != nil {
			logger.Error("Failed to reset file position", "error", err, "filename", *ticket.FileName)
			return fmt.Errorf("failed to reset file position: %w", err)
		}

		// Загружаем файл в S3
		fileURL, err := s.fileService.UploadFile(ctx, reader, "tickets", fmt.Sprintf("%d", ticket.UserID))
		if err != nil {
			logger.Error("Failed to upload file", "error", err, "filename", *ticket.FileName)
			return fmt.Errorf("failed to upload file: %w", err)
		}
		ticket.FileURL = &fileURL
		ticket.FileChecked = true
	}

	ticket.Status = models.TicketStatusNew
	ticket.CreatedAt = time.Now()
	ticket.UpdatedAt = time.Now()

	// Создаем тикет в базе данных
	id, err := s.ticketRepo.Create(ctx, ticket)
	if err != nil {
		logger.Error("Failed to create ticket in database", "error", err, "userID", ticket.UserID)
		return fmt.Errorf("failed to create ticket: %w", err)
	}
	ticket.ID = id

	// Создаем запись в истории
	comment := "Тикет создан"
	history := &models.TicketHistory{
		TicketID: ticket.ID,
		Status:   models.TicketStatusNew,
		Comment:  &comment,
	}

	if _, err := s.historyRepo.Create(ctx, history); err != nil {
		logger.Error("Failed to create ticket history", "error", err, "ticketID", ticket.ID)
		// Не возвращаем ошибку, так как основная операция уже выполнена
	}

	logger.Info("Ticket created successfully", "ticketID", ticket.ID, "userID", ticket.UserID)
	return nil
}

func (s *TicketService) GetTicket(ctx context.Context, id int64) (*models.Ticket, error) {
	ticket, err := s.ticketRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get ticket: %w", err)
	}
	return ticket, nil
}

func (s *TicketService) GetUserTickets(ctx context.Context, userID int64, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	tickets, total, err := s.ticketRepo.GetByUserID(ctx, userID, req)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get user tickets: %w", err)
	}
	return tickets, total, nil
}

func (s *TicketService) GetAllTickets(ctx context.Context, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	tickets, total, err := s.ticketRepo.GetAll(ctx, req)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get all tickets: %w", err)
	}
	return tickets, total, nil
}

func (s *TicketService) UpdateTicketStatus(ctx context.Context, id int64, status models.TicketStatus, adminID int64, comment *string) error {
	logger.Info("Updating ticket status", "ticketID", id, "status", status, "adminID", adminID)

	if err := s.ticketRepo.UpdateStatus(ctx, id, status, adminID, comment); err != nil {
		logger.Error("Failed to update ticket status", "error", err, "ticketID", id)
		return fmt.Errorf("failed to update ticket status: %w", err)
	}

	// Создаем запись в истории
	history := &models.TicketHistory{
		TicketID: id,
		Status:   status,
		Comment:  comment,
		AdminID:  &adminID,
	}
	if _, err := s.historyRepo.Create(ctx, history); err != nil {
		logger.Error("Failed to create history record", "error", err, "ticketID", id)
		return fmt.Errorf("failed to create history record: %w", err)
	}

	logger.Info("Ticket status updated successfully", "ticketID", id, "status", status)
	return nil
}

func (s *TicketService) UpdateTicketFile(ctx context.Context, id int64, fileURL string) error {
	if err := s.ticketRepo.UpdateFileURL(ctx, id, fileURL); err != nil {
		return fmt.Errorf("failed to update ticket file: %w", err)
	}
	return nil
}

func (s *TicketService) UpdateFileChecked(ctx context.Context, id int64, checked bool) error {
	if err := s.ticketRepo.UpdateFileChecked(ctx, id, checked); err != nil {
		return fmt.Errorf("failed to update file checked status: %w", err)
	}
	return nil
}

func (s *TicketService) SearchTickets(ctx context.Context, query string, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	tickets, total, err := s.ticketRepo.Search(ctx, query, req)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search tickets: %w", err)
	}
	return tickets, total, nil
}

func (s *TicketService) GetTicketHistory(ctx context.Context, ticketID int64) ([]*models.TicketHistory, error) {
	history, err := s.historyRepo.GetByTicketID(ctx, ticketID)
	if err != nil {
		return nil, fmt.Errorf("failed to get ticket history: %w", err)
	}
	return history, nil
}

func (s *TicketService) GetTicketResponses(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.Response, int, error) {
	responses, total, err := s.responseRepo.GetByTicketIDWithPagination(ctx, ticketID, page, pageSize)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get ticket responses: %w", err)
	}
	return responses, total, nil
}

func (s *TicketService) CreateResponse(ctx context.Context, response *models.Response) (int64, error) {
	logger.Info("Creating new response", "ticketID", response.TicketID)

	// Проверяем существование тикета
	ticket, err := s.ticketRepo.GetByID(ctx, response.TicketID)
	if err != nil {
		logger.Error("Failed to get ticket", "error", err, "ticketID", response.TicketID)
		return 0, fmt.Errorf("failed to get ticket: %w", err)
	}

	// Проверяем, что тикет не закрыт
	if ticket.Status == models.TicketStatusClosed {
		logger.Error("Cannot add response to closed ticket", "ticketID", response.TicketID)
		return 0, fmt.Errorf("cannot add response to closed ticket")
	}

	response.CreatedAt = time.Now()
	id, err := s.responseRepo.Create(ctx, response)
	if err != nil {
		logger.Error("Failed to create response", "error", err, "ticketID", response.TicketID)
		return 0, fmt.Errorf("failed to create response: %w", err)
	}

	// Создаем запись в истории
	comment := "Добавлен ответ"
	history := &models.TicketHistory{
		TicketID: response.TicketID,
		Status:   ticket.Status,
		Comment:  &comment,
	}
	if _, err := s.historyRepo.Create(ctx, history); err != nil {
		logger.Error("Failed to create history record", "error", err, "ticketID", response.TicketID)
		// Не возвращаем ошибку, так как основная операция уже выполнена
	}

	logger.Info("Response created successfully", "responseID", id, "ticketID", response.TicketID)
	return id, nil
}

func (s *TicketService) UpdateResponse(ctx context.Context, id int64, message string) error {
	logger.Info("Updating response", "responseID", id)

	// Получаем текущий ответ
	responses, _, err := s.responseRepo.GetByTicketIDWithPagination(ctx, id, 1, 1)
	if err != nil {
		logger.Error("Failed to get response", "error", err, "responseID", id)
		return fmt.Errorf("failed to get response: %w", err)
	}
	if len(responses) == 0 {
		logger.Error("Response not found", "responseID", id)
		return fmt.Errorf("response not found")
	}

	response := responses[0]
	
	// Проверяем, что тикет не закрыт
	ticket, err := s.ticketRepo.GetByID(ctx, response.TicketID)
	if err != nil {
		logger.Error("Failed to get ticket", "error", err, "ticketID", response.TicketID)
		return fmt.Errorf("failed to get ticket: %w", err)
	}

	if ticket.Status == models.TicketStatusClosed {
		logger.Error("Cannot update response in closed ticket", "ticketID", response.TicketID)
		return fmt.Errorf("cannot update response in closed ticket")
	}

	if err := s.responseRepo.UpdateMessage(ctx, id, message); err != nil {
		logger.Error("Failed to update response", "error", err, "responseID", id)
		return fmt.Errorf("failed to update response: %w", err)
	}

	// Создаем запись в истории
	comment := "Ответ обновлен"
	history := &models.TicketHistory{
		TicketID: response.TicketID,
		Status:   ticket.Status,
		Comment:  &comment,
	}
	if _, err := s.historyRepo.Create(ctx, history); err != nil {
		logger.Error("Failed to create history record", "error", err, "ticketID", response.TicketID)
		// Не возвращаем ошибку, так как основная операция уже выполнена
	}

	logger.Info("Response updated successfully", "responseID", id)
	return nil
}

func (s *TicketService) UpdateResponseFile(ctx context.Context, id int64, fileURL string) error {
	if err := s.responseRepo.UpdateFileURL(ctx, id, fileURL); err != nil {
		return fmt.Errorf("failed to update response file: %w", err)
	}
	return nil
}

func (s *TicketService) DeleteResponse(ctx context.Context, id int64) error {
	logger.Info("Deleting response", "responseID", id)

	// Получаем текущий ответ
	responses, _, err := s.responseRepo.GetByTicketIDWithPagination(ctx, id, 1, 1)
	if err != nil {
		logger.Error("Failed to get response", "error", err, "responseID", id)
		return fmt.Errorf("failed to get response: %w", err)
	}
	if len(responses) == 0 {
		logger.Error("Response not found", "responseID", id)
		return fmt.Errorf("response not found")
	}

	response := responses[0]
	
	// Проверяем, что тикет не закрыт
	ticket, err := s.ticketRepo.GetByID(ctx, response.TicketID)
	if err != nil {
		logger.Error("Failed to get ticket", "error", err, "ticketID", response.TicketID)
		return fmt.Errorf("failed to get ticket: %w", err)
	}

	if ticket.Status == models.TicketStatusClosed {
		logger.Error("Cannot delete response in closed ticket", "ticketID", response.TicketID)
		return fmt.Errorf("cannot delete response in closed ticket")
	}

	if err := s.responseRepo.Delete(ctx, id); err != nil {
		logger.Error("Failed to delete response", "error", err, "responseID", id)
		return fmt.Errorf("failed to delete response: %w", err)
	}

	// Создаем запись в истории
	comment := "Ответ удален"
	history := &models.TicketHistory{
		TicketID: response.TicketID,
		Status:   ticket.Status,
		Comment:  &comment,
	}
	if _, err := s.historyRepo.Create(ctx, history); err != nil {
		logger.Error("Failed to create history record", "error", err, "ticketID", response.TicketID)
		// Не возвращаем ошибку, так как основная операция уже выполнена
	}

	logger.Info("Response deleted successfully", "responseID", id)
	return nil
} 