package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"

	"github.com/your-org/ticket-service/internal/models"
	"github.com/your-org/ticket-service/internal/repository"
	"github.com/your-org/ticket-service/internal/storage"
)

type TicketService struct {
    repo   *repository.TicketRepository
    s3     *storage.S3Storage
    queue  *asynq.Client
}

func NewTicketService(repo *repository.TicketRepository, s3 *storage.S3Storage, queue *asynq.Client) *TicketService {
    return &TicketService{repo, s3, queue}
}

func (s *TicketService) CreateTicket(ctx context.Context, userID uuid.UUID, title, description string) (uuid.UUID, string, error) {
    ticketID := uuid.New()
    ticket := &models.Ticket{
        ID:          ticketID,
        UserID:      userID,
        Title:       title,
        Description: description,
        Status:      models.StatusOpen,
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    if err := s.repo.CreateTicket(ctx, ticket); err != nil {
        return uuid.UUID{}, "", err
    }

    presignedURL, err := s.s3.GeneratePresignedURL(ticketID.String())
    if err != nil {
        return uuid.UUID{}, "", err
    }

    // Enqueue notification
    task := asynq.NewTask("send_notification", map[string]interface{}{
        "user_id": userID.String(),
        "ticket_id": ticketID.String(),
        "type": "email",
        "message": "Your ticket has been created",
    })
    if _, err := s.queue.Enqueue(task); err != nil {
        // Log error but don't fail the request
    }

    return ticketID, presignedURL, nil
}

func (s *TicketService) GetTicket(ctx context.Context, id uuid.UUID) (*models.Ticket, error) {
    return s.repo.GetTicketByID(ctx, id)
}

func (s *TicketService) GetUserTickets(ctx context.Context, userID uuid.UUID) ([]*models.Ticket, error) {
    return s.repo.GetTicketsByUserID(ctx, userID)
}

func (s *TicketService) UpdateTicketStatus(ctx context.Context, id uuid.UUID, status models.TicketStatus) error {
    return s.repo.UpdateTicketStatus(ctx, id, status)
}

func (s *TicketService) AddAttachment(ctx context.Context, ticketID uuid.UUID, fileName, fileType string, fileSize int64) (string, error) {
    attachmentID := uuid.New()
    filePath := "tickets/" + ticketID.String() + "/" + attachmentID.String()
    attachment := &models.TicketAttachment{
        ID:         attachmentID,
        TicketID:   ticketID,
        FilePath:   filePath,
        FileName:   fileName,
        FileSize:   fileSize,
        FileType:   fileType,
        UploadedAt: time.Now(),
    }

    if err := s.repo.CreateAttachment(ctx, attachment); err != nil {
        return "", err
    }

    return s.s3.GeneratePresignedURL(filePath)
}

func (s *TicketService) AddMessage(ctx context.Context, ticketID, senderID uuid.UUID, message string) error {
    msg := &models.TicketMessage{
        ID:        uuid.New(),
        TicketID:  ticketID,
        SenderID:  senderID,
        Message:   message,
        CreatedAt: time.Now(),
    }
    return s.repo.CreateMessage(ctx, msg)
}