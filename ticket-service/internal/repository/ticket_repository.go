package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/your-org/ticket-service/internal/models"
)

type TicketRepository struct {
    db *pgx.Conn
}
	
func NewTicketRepository(db *pgx.Conn) *TicketRepository {
    return &TicketRepository{db}
}

func (r *TicketRepository) CreateTicket(ctx context.Context, ticket *models.Ticket) error {
    query := `INSERT INTO tickets (id, user_id, title, description, status, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`
    _, err := r.db.Exec(ctx, query, ticket.ID, ticket.UserID, ticket.Title, ticket.Description, ticket.Status, ticket.CreatedAt, ticket.UpdatedAt)
    return err
}

func (r *TicketRepository) GetTicketByID(ctx context.Context, id uuid.UUID) (*models.Ticket, error) {
    query := `SELECT id, user_id, title, description, status, created_at, updated_at
              FROM tickets WHERE id = $1`
    ticket := &models.Ticket{}
    err := r.db.QueryRow(ctx, query, id).Scan(
        &ticket.ID, &ticket.UserID, &ticket.Title, &ticket.Description, &ticket.Status, &ticket.CreatedAt, &ticket.UpdatedAt,
    )
    if err != nil {
        return nil, err
    }
    return ticket, nil
}

func (r *TicketRepository) GetTicketsByUserID(ctx context.Context, userID uuid.UUID) ([]*models.Ticket, error) {
    query := `SELECT id, user_id, title, description, status, created_at, updated_at
              FROM tickets WHERE user_id = $1`
    rows, err := r.db.Query(ctx, query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var tickets []*models.Ticket
    for rows.Next() {
        ticket := &models.Ticket{}
        if err := rows.Scan(&ticket.ID, &ticket.UserID, &ticket.Title, &ticket.Description, &ticket.Status, &ticket.CreatedAt, &ticket.UpdatedAt); err != nil {
            return nil, err
        }
        tickets = append(tickets, ticket)
    }
    return tickets, nil
}

func (r *TicketRepository) UpdateTicketStatus(ctx context.Context, id uuid.UUID, status models.TicketStatus) error {
    query := `UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
    _, err := r.db.Exec(ctx, query, status, id)
    return err
}

func (r *TicketRepository) CreateAttachment(ctx context.Context, attachment *models.TicketAttachment) error {
    query := `INSERT INTO ticket_attachments (id, ticket_id, file_path, file_name, file_size, file_type, uploaded_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`
    _, err := r.db.Exec(ctx, query, attachment.ID, attachment.TicketID, attachment.FilePath, attachment.FileName, attachment.FileSize, attachment.FileType, attachment.UploadedAt)
    return err
}

func (r *TicketRepository) CreateMessage(ctx context.Context, message *models.TicketMessage) error {
    query := `INSERT INTO ticket_messages (id, ticket_id, sender_id, message, created_at)
              VALUES ($1, $2, $3, $4, $5)`
    _, err := r.db.Exec(ctx, query, message.ID, message.TicketID, message.SenderID, message.Message, message.CreatedAt)
    return err
}