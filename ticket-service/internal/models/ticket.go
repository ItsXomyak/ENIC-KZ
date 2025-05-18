package models

import (
	"time"

	"github.com/google/uuid"
)

type TicketStatus string

const (
    StatusOpen       TicketStatus = "open"
    StatusInProgress TicketStatus = "in_progress"
    StatusClosed     TicketStatus = "closed"
    StatusRejected   TicketStatus = "rejected"
)

type Ticket struct {
    ID          uuid.UUID    `json:"id"`
    UserID      uuid.UUID    `json:"user_id"`
    Title       string       `json:"title" validate:"required"`
    Description string       `json:"description" validate:"required"`
    Status      TicketStatus `json:"status"`
    CreatedAt   time.Time    `json:"created_at"`
    UpdatedAt   time.Time    `json:"updated_at"`
}

type TicketAttachment struct {
    ID         uuid.UUID `json:"id"`
    TicketID   uuid.UUID `json:"ticket_id"`
    FilePath   string    `json:"file_path"`
    FileName   string    `json:"file_name"`
    FileSize   int64     `json:"file_size"`
    FileType   string    `json:"file_type"`
    UploadedAt time.Time `json:"uploaded_at"`
}

type TicketMessage struct {
    ID        uuid.UUID `json:"id"`
    TicketID  uuid.UUID `json:"ticket_id"`
    SenderID  uuid.UUID `json:"sender_id"`
    Message   string    `json:"message" validate:"required"`
    CreatedAt time.Time `json:"created_at"`
}