package repositories

import (
	"context"

	"ticket-service/internal/domain/models"
)

// TicketRepository определяет методы для работы с тикетами
type TicketRepository interface {
	Create(ctx context.Context, ticket *models.Ticket) (int64, error)
	GetByID(ctx context.Context, id int64) (*models.Ticket, error)
	GetByUserID(ctx context.Context, userID int64, req models.GetTicketsRequest) ([]*models.Ticket, int64, error)
	GetAll(ctx context.Context, req models.GetTicketsRequest) ([]*models.Ticket, int64, error)
	UpdateStatus(ctx context.Context, id int64, status models.TicketStatus, adminID int64, comment *string) error
	UpdateFileURL(ctx context.Context, id int64, fileURL string) error
	UpdateFileChecked(ctx context.Context, id int64, checked bool) error
	Search(ctx context.Context, query string, req models.GetTicketsRequest) ([]*models.Ticket, int64, error)
}

// TicketHistoryRepository определяет методы для работы с историей тикетов
type TicketHistoryRepository interface {
	Create(ctx context.Context, history *models.TicketHistory) (int64, error)
	GetByTicketID(ctx context.Context, ticketID int64) ([]*models.TicketHistory, error)
	GetLastByTicketID(ctx context.Context, ticketID int64) (*models.TicketHistory, error)
	GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.TicketHistory, int, error)
}

// ResponseRepository определяет методы для работы с ответами на тикеты
type ResponseRepository interface {
	Create(ctx context.Context, response *models.Response) (int64, error)
	GetByTicketID(ctx context.Context, ticketID int64) ([]*models.Response, error)
	GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.Response, int, error)
	UpdateMessage(ctx context.Context, id int64, message string) error
	UpdateFileURL(ctx context.Context, id int64, fileURL string) error
	Delete(ctx context.Context, id int64) error
}

type HistoryRepository interface {
	Create(ctx context.Context, history *models.TicketHistory) (int64, error)
	GetByTicketID(ctx context.Context, ticketID int64) ([]*models.TicketHistory, error)
	GetLastByTicketID(ctx context.Context, ticketID int64) (*models.TicketHistory, error)
	GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.TicketHistory, int, error)
}

