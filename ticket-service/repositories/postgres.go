package repositories

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"ticket-service/config"
	"ticket-service/logger"
	"ticket-service/models"
)

type PostgresRepository struct {
	db *sqlx.DB
}

func NewPostgresRepository(db *sqlx.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

func NewPostgresDB(cfg *config.Config) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", cfg.PostgresDSN)
	if err != nil {
		return nil, err
	}
	logger.Info("Connected to PostgreSQL")
	return db, nil
}

// DB возвращает указатель на sqlx.DB
func (r *PostgresRepository) DB() *sqlx.DB {
	return r.db
}

func (r *PostgresRepository) CreateTicket(ticket *models.Ticket) error {
	query := `
		INSERT INTO tickets (id, user_id, full_name, email, phone_number, telegram_id, question, document_type, country, file_url, status, created_at, updated_at)
		VALUES (:id, :user_id, :full_name, :email, :phone_number, :telegram_id, :question, :document_type, :country, :file_url, :status, :created_at, :updated_at)
	`
	_, err := r.db.NamedExec(query, ticket)
	return err
}

func (r *PostgresRepository) GetTicket(id string) (*models.Ticket, error) {
	var ticket models.Ticket
	query := `SELECT * FROM tickets WHERE id = $1`
	err := r.db.Get(&ticket, query, id)
	return &ticket, err
}

func (r *PostgresRepository) ListTickets(userID string, params models.ListTicketsRequest) ([]models.Ticket, int, error) {
	var tickets []models.Ticket
	query := `SELECT * FROM tickets WHERE user_id = $1`
	args := []interface{}{userID}

	if params.Status != nil {
		query += ` AND status = $2`
		args = append(args, *params.Status)
	}
	if params.CreatedAfter != nil {
		query += ` AND created_at >= $3`
		args = append(args, *params.CreatedAfter)
	}

	// Подсчет общего количества
	var total int
	countQuery := `SELECT COUNT(*) FROM tickets WHERE user_id = $1`
	if params.Status != nil {
		countQuery += ` AND status = $2`
	}
	if params.CreatedAfter != nil {
		countQuery += ` AND created_at >= $3`
	}
	err := r.db.Get(&total, countQuery, args...)
	if err != nil {
		return nil, 0, err
	}

	// Пагинация
	offset := (params.Page - 1) * params.Limit
	query += ` ORDER BY created_at DESC LIMIT $4 OFFSET $5`
	args = append(args, params.Limit, offset)

	err = r.db.Select(&tickets, query, args...)
	return tickets, total, err
}

func (r *PostgresRepository) CountTickets(userID string) (int, error) {
	var total int
	query := `SELECT COUNT(*) FROM tickets WHERE user_id = $1`
	err := r.db.Get(&total, query, userID)
	return total, err
}

func (r *PostgresRepository) UpdateTicketStatus(id string, status models.TicketStatus, comment *string, adminID *string, fileURL *string) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Обновление статуса тикета
	query := `UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err = tx.Exec(query, status, id)
	if err != nil {
		return err
	}

	// Добавление записи в ticket_responses
	response := models.TicketResponse{
		ID:       uuid.New().String(),
		TicketID: id,
		AdminID:  adminID,
		Status:   status,
		Comment:  comment,
		FileURL:  fileURL,
		CreatedAt: time.Now(),
	}
	query = `
		INSERT INTO ticket_responses (id, ticket_id, admin_id, status, comment, file_url, created_at)
		VALUES (:id, :ticket_id, :admin_id, :status, :comment, :file_url, :created_at)
	`
	_, err = tx.NamedExec(query, response)
	if err != nil {
		return err
	}

	return tx.Commit()
}