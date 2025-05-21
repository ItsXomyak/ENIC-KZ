package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/repositories"
	"ticket-service/internal/logger"
)

type ticketRepository struct {
	db *pgxpool.Pool
}

func NewTicketRepository(db *pgxpool.Pool) repositories.TicketRepository {
	logger.Info("Creating new ticket repository")
	return &ticketRepository{db: db}
}

func (r *ticketRepository) Create(ctx context.Context, ticket *models.Ticket) (int64, error) {
	logger.Info("Creating new ticket", "userID", ticket.UserID, "subject", ticket.Subject)

	var id int64
	err := r.db.QueryRow(ctx, `
		INSERT INTO tickets 
		(user_id, subject, question, full_name, email, phone, telegram_id, status, notify_email, notify_tg) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id`,
		ticket.UserID, ticket.Subject, ticket.Question, ticket.FullName,
		ticket.Email, ticket.Phone, ticket.TelegramID, ticket.Status,
		ticket.NotifyEmail, ticket.NotifyTG,
	).Scan(&id)

	if err != nil {
		logger.Error("Failed to create ticket", "error", err)
		return 0, fmt.Errorf("failed to create ticket: %w", err)
	}

	return id, nil
}

func (r *ticketRepository) GetByID(ctx context.Context, id int64) (*models.Ticket, error) {
	logger.Info("Getting ticket by ID", "id", id)

	ticket := &models.Ticket{}
	err := r.db.QueryRow(ctx, `
		SELECT id, user_id, subject, question, full_name, email, phone, telegram_id, 
		file_url, file_checked, status, notify_email, notify_tg, created_at, updated_at 
		FROM tickets WHERE id = $1`, id).Scan(
		&ticket.ID, &ticket.UserID, &ticket.Subject, &ticket.Question,
		&ticket.FullName, &ticket.Email, &ticket.Phone, &ticket.TelegramID,
		&ticket.FileURL, &ticket.FileChecked, &ticket.Status, &ticket.NotifyEmail,
		&ticket.NotifyTG, &ticket.CreatedAt, &ticket.UpdatedAt,
	)

	if err == pgx.ErrNoRows {
		logger.Warn("Ticket not found", "id", id)
		return nil, nil
	}
	if err != nil {
		logger.Error("Failed to get ticket", "error", err)
		return nil, fmt.Errorf("failed to get ticket: %w", err)
	}

	return ticket, nil
}

func (r *ticketRepository) GetByUserID(ctx context.Context, userID int64, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	logger.Info("Getting tickets by user ID", "userID", userID, "page", req.Page, "pageSize", req.PageSize)

	query := `
		SELECT id, user_id, subject, question, full_name, email, phone, telegram_id,
			file_url, file_checked, status, notify_email, notify_tg, created_at, updated_at
		FROM tickets WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	offset := (req.Page - 1) * req.PageSize
	rows, err := r.db.Query(ctx, query, userID, req.PageSize, offset)
	if err != nil {
		logger.Error("Failed to get user tickets", "error", err)
		return nil, 0, fmt.Errorf("failed to get user tickets: %w", err)
	}
	defer rows.Close()

	var tickets []*models.Ticket
	for rows.Next() {
		var ticket models.Ticket
		err := rows.Scan(
			&ticket.ID, &ticket.UserID, &ticket.Subject, &ticket.Question,
			&ticket.FullName, &ticket.Email, &ticket.Phone, &ticket.TelegramID,
			&ticket.FileURL, &ticket.FileChecked, &ticket.Status, &ticket.NotifyEmail,
			&ticket.NotifyTG, &ticket.CreatedAt, &ticket.UpdatedAt,
		)
		if err != nil {
			logger.Error("Failed to scan ticket", "error", err)
			return nil, 0, fmt.Errorf("failed to scan ticket: %w", err)
		}
		tickets = append(tickets, &ticket)
	}

	// Получаем общее количество тикетов
	var total int64
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM tickets WHERE user_id = $1", userID).Scan(&total)
	if err != nil {
		logger.Error("Failed to get total count", "error", err)
		return nil, 0, fmt.Errorf("failed to get total count: %w", err)
	}

	return tickets, total, nil
}

func (r *ticketRepository) GetAll(ctx context.Context, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	logger.Info("Getting all tickets", "page", req.Page, "pageSize", req.PageSize)

	query := `
		SELECT id, user_id, subject, question, full_name, email, phone, telegram_id,
			file_url, file_checked, status, notify_email, notify_tg, created_at, updated_at
		FROM tickets
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2`

	offset := (req.Page - 1) * req.PageSize
	rows, err := r.db.Query(ctx, query, req.PageSize, offset)
	if err != nil {
		logger.Error("Failed to get all tickets", "error", err)
		return nil, 0, fmt.Errorf("failed to get all tickets: %w", err)
	}
	defer rows.Close()

	var tickets []*models.Ticket
	for rows.Next() {
		var ticket models.Ticket
		err := rows.Scan(
			&ticket.ID, &ticket.UserID, &ticket.Subject, &ticket.Question,
			&ticket.FullName, &ticket.Email, &ticket.Phone, &ticket.TelegramID,
			&ticket.FileURL, &ticket.FileChecked, &ticket.Status, &ticket.NotifyEmail,
			&ticket.NotifyTG, &ticket.CreatedAt, &ticket.UpdatedAt,
		)
		if err != nil {
			logger.Error("Failed to scan ticket", "error", err)
			return nil, 0, fmt.Errorf("failed to scan ticket: %w", err)
		}
		tickets = append(tickets, &ticket)
	}

	// Получаем общее количество тикетов
	var total int64
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM tickets").Scan(&total)
	if err != nil {
		logger.Error("Failed to get total count", "error", err)
		return nil, 0, fmt.Errorf("failed to get total count: %w", err)
	}

	return tickets, total, nil
}

func (r *ticketRepository) UpdateStatus(ctx context.Context, id int64, status models.TicketStatus, adminID int64, comment *string) error {
	logger.Info("Updating ticket status", "id", id, "status", status)

	query := `
		UPDATE tickets
		SET status = $1, updated_at = $2
		WHERE id = $3`

	_, err := r.db.Exec(ctx, query, status, time.Now(), id)
	if err != nil {
		logger.Error("Failed to update ticket status", "error", err)
		return fmt.Errorf("failed to update ticket status: %w", err)
	}

	return nil
}

func (r *ticketRepository) UpdateFileURL(ctx context.Context, id int64, fileURL string) error {
	logger.Info("Updating ticket file URL", "id", id)

	query := `
		UPDATE tickets
		SET file_url = $1, updated_at = $2
		WHERE id = $3`

	_, err := r.db.Exec(ctx, query, fileURL, time.Now(), id)
	if err != nil {
		logger.Error("Failed to update ticket file URL", "error", err)
		return fmt.Errorf("failed to update ticket file URL: %w", err)
	}

	return nil
}

func (r *ticketRepository) UpdateFileChecked(ctx context.Context, id int64, checked bool) error {
	logger.Info("Updating file checked status", "id", id, "checked", checked)

	query := `
		UPDATE tickets
		SET file_checked = $1, updated_at = $2
		WHERE id = $3`

	_, err := r.db.Exec(ctx, query, checked, time.Now(), id)
	if err != nil {
		logger.Error("Failed to update file checked status", "error", err)
		return fmt.Errorf("failed to update file checked status: %w", err)
	}

	return nil
}

func (r *ticketRepository) Search(ctx context.Context, query string, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	logger.Info("Searching tickets", "query", query, "page", req.Page, "pageSize", req.PageSize)

	searchQuery := `
		SELECT id, user_id, subject, question, full_name, email, phone, telegram_id,
			file_url, file_checked, status, notify_email, notify_tg, created_at, updated_at
		FROM tickets
		WHERE subject ILIKE $1 OR question ILIKE $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	searchPattern := "%" + query + "%"
	offset := (req.Page - 1) * req.PageSize
	rows, err := r.db.Query(ctx, searchQuery, searchPattern, req.PageSize, offset)
	if err != nil {
		logger.Error("Failed to search tickets", "error", err)
		return nil, 0, fmt.Errorf("failed to search tickets: %w", err)
	}
	defer rows.Close()

	var tickets []*models.Ticket
	for rows.Next() {
		var ticket models.Ticket
		err := rows.Scan(
			&ticket.ID, &ticket.UserID, &ticket.Subject, &ticket.Question,
			&ticket.FullName, &ticket.Email, &ticket.Phone, &ticket.TelegramID,
			&ticket.FileURL, &ticket.FileChecked, &ticket.Status, &ticket.NotifyEmail,
			&ticket.NotifyTG, &ticket.CreatedAt, &ticket.UpdatedAt,
		)
		if err != nil {
			logger.Error("Failed to scan ticket", "error", err)
			return nil, 0, fmt.Errorf("failed to scan ticket: %w", err)
		}
		tickets = append(tickets, &ticket)
	}

	// Получаем общее количество найденных тикетов
	var total int64
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM tickets WHERE subject ILIKE $1 OR question ILIKE $1", searchPattern).Scan(&total)
	if err != nil {
		logger.Error("Failed to get total count", "error", err)
		return nil, 0, fmt.Errorf("failed to get total count: %w", err)
	}

	return tickets, total, nil
}