package services

import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"
	"ticket-service/internal/logger"
)

type TicketService struct {
	ticketRepo      repositories.TicketRepository
	historyRepo     repositories.TicketHistoryRepository
	responseRepo    repositories.ResponseRepository
	antivirusService AntivirusService
	fileService     FileService
}

func NewTicketService(
	ticketRepo repositories.TicketRepository,
	historyRepo repositories.TicketHistoryRepository,
	responseRepo repositories.ResponseRepository,
	antivirusService AntivirusService,
	fileService FileService,
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
		return fmt.Errorf("antivirus service is not available")
	}

	if fileReader != nil {
		if ticket.FileName == nil || ticket.FileType == nil {
			return errors.New("file name and type are required when file is provided")
		}

		// Сканируем файл
		result, err := s.antivirusService.ScanFile(ctx, fileReader)
		if err != nil {
			logger.Error("Failed to scan file", "error", err)
			return fmt.Errorf("failed to scan file: %w", err)
		}

		if result.IsInfected {
			logger.Error("File contains malware", "filename", *ticket.FileName, "virusName", result.VirusName)
			return fmt.Errorf("file contains malware: %s", result.VirusName)
		}

		// Загружаем файл в S3
		fileURL, err := s.fileService.UploadFile(ctx, fileReader, *ticket.FileName, *ticket.FileType)
		if err != nil {
			logger.Error("Failed to upload file", "error", err)
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
		logger.Error("Failed to create ticket history", "error", err)
		// Не возвращаем ошибку, так как основная операция уже выполнена
	}

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
	if err := s.ticketRepo.UpdateStatus(ctx, id, status, adminID, comment); err != nil {
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
		return fmt.Errorf("failed to create history record: %w", err)
	}

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
	response.CreatedAt = time.Now()
	id, err := s.responseRepo.Create(ctx, response)
	if err != nil {
		return 0, fmt.Errorf("failed to create response: %w", err)
	}
	return id, nil
}

func (s *TicketService) UpdateResponse(ctx context.Context, id int64, message string) error {
	if err := s.responseRepo.UpdateMessage(ctx, id, message); err != nil {
		return fmt.Errorf("failed to update response: %w", err)
	}
	return nil
}

func (s *TicketService) UpdateResponseFile(ctx context.Context, id int64, fileURL string) error {
	if err := s.responseRepo.UpdateFileURL(ctx, id, fileURL); err != nil {
		return fmt.Errorf("failed to update response file: %w", err)
	}
	return nil
}

func (s *TicketService) DeleteResponse(ctx context.Context, id int64) error {
	if err := s.responseRepo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete response: %w", err)
	}
	return nil
} 