package postgres

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"
)

type responseRepository struct {
	pool *pgxpool.Pool
}

func NewResponseRepository(pool *pgxpool.Pool) repositories.ResponseRepository {
	return &responseRepository{pool: pool}
}

func (r *responseRepository) Create(ctx context.Context, response *models.Response) (int64, error) {
	var id int64
	err := r.pool.QueryRow(ctx, `
		INSERT INTO ticket_responses 
		(ticket_id, admin_id, message) 
		VALUES ($1, $2, $3) 
		RETURNING id`,
		response.TicketID, response.AdminID, response.Message).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to create response: %w", err)
	}
	return id, nil
}

func (r *responseRepository) GetByTicketID(ctx context.Context, ticketID int64) ([]*models.Response, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, ticket_id, admin_id, message, file_url, created_at 
		FROM ticket_responses 
		WHERE ticket_id = $1 
		ORDER BY created_at ASC`, ticketID)
	if err != nil {
		return nil, fmt.Errorf("failed to query responses: %w", err)
	}
	defer rows.Close()

	responses := make([]*models.Response, 0)
	for rows.Next() {
		resp := &models.Response{}
		err := rows.Scan(&resp.ID, &resp.TicketID, &resp.AdminID, &resp.Message, &resp.FileURL, &resp.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan response: %w", err)
		}
		responses = append(responses, resp)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over responses: %w", err)
	}

	return responses, nil
}

func (r *responseRepository) GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.Response, int, error) {
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
		FROM ticket_responses 
		WHERE ticket_id = $1`, ticketID).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count responses: %w", err)
	}

	// Get responses with pagination
	rows, err := r.pool.Query(ctx, `
		SELECT id, ticket_id, admin_id, message, file_url, created_at 
		FROM ticket_responses 
		WHERE ticket_id = $1 
		ORDER BY created_at DESC 
		LIMIT $2 
		OFFSET $3`, ticketID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query responses: %w", err)
	}
	defer rows.Close()

	responses := make([]*models.Response, 0)
	for rows.Next() {
		resp := &models.Response{}
		err := rows.Scan(&resp.ID, &resp.TicketID, &resp.AdminID, &resp.Message, &resp.FileURL, &resp.CreatedAt)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan response: %w", err)
		}
		responses = append(responses, resp)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("error iterating over responses: %w", err)
	}

	return responses, total, nil
}

func (r *responseRepository) UpdateMessage(ctx context.Context, id int64, message string) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE ticket_responses 
		SET message = $1
		WHERE id = $2`,
		message, id)
	if err != nil {
		return fmt.Errorf("failed to update response message: %w", err)
	}
	return nil
}

func (r *responseRepository) UpdateFileURL(ctx context.Context, id int64, fileURL string) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE ticket_responses 
		SET file_url = $1
		WHERE id = $2`,
		fileURL, id)
	if err != nil {
		return fmt.Errorf("failed to update response file URL: %w", err)
	}
	return nil
}

func (r *responseRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM ticket_responses 
		WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("failed to delete response: %w", err)
	}
	return nil
} 