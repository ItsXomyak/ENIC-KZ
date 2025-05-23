package postgres

import (
	"context"
	"fmt"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"

	"github.com/jackc/pgx/v5/pgxpool"
)

type historyRepository struct {
	pool *pgxpool.Pool
}

func NewHistoryRepository(pool *pgxpool.Pool) repositories.HistoryRepository {
	return &historyRepository{pool: pool}
}

func (r *historyRepository) Create(ctx context.Context, history *models.TicketHistory) (int64, error) {
	var id int64
	err := r.pool.QueryRow(ctx, `
		INSERT INTO ticket_history 
		(ticket_id, status, comment, admin_id) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id`,
		history.TicketID, history.Status, history.Comment, history.AdminID).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to create history record: %w", err)
	}
	return id, nil
}

func (r *historyRepository) GetByTicketID(ctx context.Context, ticketID int64) ([]*models.TicketHistory, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, ticket_id, status, comment, admin_id, created_at 
		FROM ticket_history 
		WHERE ticket_id = $1 
		ORDER BY created_at ASC`, ticketID)
	if err != nil {
		return nil, fmt.Errorf("failed to query history: %w", err)
	}
	defer rows.Close()

	records := make([]*models.TicketHistory, 0)
	for rows.Next() {
		h := &models.TicketHistory{}
		err := rows.Scan(&h.ID, &h.TicketID, &h.Status, &h.Comment, &h.AdminID, &h.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan history record: %w", err)
		}
		records = append(records, h)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over history records: %w", err)
	}

	return records, nil
}

func (r *historyRepository) GetLastByTicketID(ctx context.Context, ticketID int64) (*models.TicketHistory, error) {
	history := &models.TicketHistory{}
	err := r.pool.QueryRow(ctx, `
		SELECT id, ticket_id, status, comment, admin_id, created_at 
		FROM ticket_history 
		WHERE ticket_id = $1 
		ORDER BY created_at DESC 
		LIMIT 1`, ticketID).Scan(
		&history.ID, &history.TicketID, &history.Status, &history.Comment, &history.AdminID, &history.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get last history record: %w", err)
	}
	return history, nil
}

func (r *historyRepository) GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.TicketHistory, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	// Get total count
	var total int
	err := r.pool.QueryRow(ctx, `
		SELECT COUNT(*) 
		FROM ticket_history 
		WHERE ticket_id = $1`, ticketID).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count history records: %w", err)
	}

	// Get history records with pagination
	rows, err := r.pool.Query(ctx, `
		SELECT id, ticket_id, status, comment, admin_id, created_at 
		FROM ticket_history 
		WHERE ticket_id = $1 
		ORDER BY created_at DESC 
		LIMIT $2 
		OFFSET $3`, ticketID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query history records: %w", err)
	}
	defer rows.Close()

	records := make([]*models.TicketHistory, 0)
	for rows.Next() {
		h := &models.TicketHistory{}
		err := rows.Scan(&h.ID, &h.TicketID, &h.Status, &h.Comment, &h.AdminID, &h.CreatedAt)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan history record: %w", err)
		}
		records = append(records, h)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("error iterating over history records: %w", err)
	}

	return records, total, nil
} 