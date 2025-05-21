package services

import (
	"context"
	"fmt"
	"io"
	"time"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"
	"ticket-service/internal/logger"
)

type ResponseService struct {
	responseRepo repositories.ResponseRepository
}

func NewResponseService(
	responseRepo repositories.ResponseRepository,
) *ResponseService {
	return &ResponseService{
		responseRepo: responseRepo,
	}
}

// CreateResponse создает новый ответ на тикет
func (s *ResponseService) CreateResponse(ctx context.Context, response *models.Response, file io.Reader) error {
	logger.Info("Creating new response", "ticketID", response.TicketID, "adminID", response.AdminID)

	response.CreatedAt = time.Now()
	_, err := s.responseRepo.Create(ctx, response)
	if err != nil {
		logger.Error("Failed to create response", "error", err)
		return fmt.Errorf("failed to create response: %w", err)
	}

	return nil
}

// GetTicketResponses получает все ответы на тикет
func (s *ResponseService) GetTicketResponses(ctx context.Context, ticketID int64) ([]*models.Response, error) {
	logger.Info("Getting responses by ticket ID", "ticketID", ticketID)

	responses, err := s.responseRepo.GetByTicketID(ctx, ticketID)
	if err != nil {
		logger.Error("Failed to get responses", "error", err)
		return nil, fmt.Errorf("failed to get responses: %w", err)
	}

	return responses, nil
}

func (s *ResponseService) GetByTicketID(ctx context.Context, ticketID int64) ([]*models.Response, error) {
	logger.Info("Getting responses by ticket ID", "ticketID", ticketID)

	responses, err := s.responseRepo.GetByTicketID(ctx, ticketID)
	if err != nil {
		logger.Error("Failed to get responses", "error", err)
		return nil, fmt.Errorf("failed to get responses: %w", err)
	}

	return responses, nil
}

func (s *ResponseService) GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.Response, int, error) {
	logger.Info("Getting paginated responses", "ticketID", ticketID, "page", page, "pageSize", pageSize)

	responses, total, err := s.responseRepo.GetByTicketIDWithPagination(ctx, ticketID, page, pageSize)
	if err != nil {
		logger.Error("Failed to get paginated responses", "error", err)
		return nil, 0, fmt.Errorf("failed to get paginated responses: %w", err)
	}

	return responses, total, nil
}

func (s *ResponseService) UpdateMessage(ctx context.Context, id int64, message string) error {
	logger.Info("Updating response message", "responseID", id)

	if err := s.responseRepo.UpdateMessage(ctx, id, message); err != nil {
		logger.Error("Failed to update response message", "error", err)
		return fmt.Errorf("failed to update response message: %w", err)
	}

	return nil
}

func (s *ResponseService) UpdateFileURL(ctx context.Context, id int64, fileURL string) error {
	logger.Info("Updating response file URL", "responseID", id)

	if err := s.responseRepo.UpdateFileURL(ctx, id, fileURL); err != nil {
		logger.Error("Failed to update response file URL", "error", err)
		return fmt.Errorf("failed to update response file URL: %w", err)
	}

	return nil
}

func (s *ResponseService) Delete(ctx context.Context, id int64) error {
	logger.Info("Deleting response", "responseID", id)

	if err := s.responseRepo.Delete(ctx, id); err != nil {
		logger.Error("Failed to delete response", "error", err)
		return fmt.Errorf("failed to delete response: %w", err)
	}

	return nil
} 