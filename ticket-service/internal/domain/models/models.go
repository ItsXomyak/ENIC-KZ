package models

import (
	"time"
)

type TicketStatus string

const (
	TicketStatusNew        TicketStatus = "new"
	TicketStatusInProgress TicketStatus = "in_progress"
	TicketStatusClosed     TicketStatus = "closed"
)

type Ticket struct {
	ID          int64        `json:"id"`
	UserID      int64        `json:"user_id"`
	Subject     string       `json:"subject"`
	Question    string       `json:"question"`
	FullName    string       `json:"full_name"`
	Email       string       `json:"email"`
	Phone       *string      `json:"phone,omitempty"`
	TelegramID  *string      `json:"telegram_id,omitempty"`
	FileURL     *string      `json:"file_url,omitempty"`
	FileName    *string      `json:"file_name,omitempty"`
	FileType    *string      `json:"file_type,omitempty"`
	FileChecked bool         `json:"file_checked"`
	Status      TicketStatus `json:"status"`
	NotifyEmail bool         `json:"notify_email"`
	NotifyTG    bool         `json:"notify_tg"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

type TicketHistory struct {
	ID        int64        `json:"id"`
	TicketID  int64        `json:"ticket_id"`
	Status    TicketStatus `json:"status"`
	Comment   *string      `json:"comment,omitempty"`
	AdminID   *int64       `json:"admin_id,omitempty"`
	CreatedAt time.Time    `json:"created_at"`
}

type Response struct {
	ID        int64     `json:"id"`
	TicketID  int64     `json:"ticket_id"`
	AdminID   int64     `json:"admin_id"`
	Message   string    `json:"message"`
	FileURL   *string   `json:"file_url,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type GetTicketsRequest struct {
	Page     int         `json:"page" form:"page"`
	PageSize int         `json:"page_size" form:"page_size"`
	Status   TicketStatus `json:"status" form:"status"`
	FromDate string      `json:"from_date" form:"from_date"`
	ToDate   string      `json:"to_date" form:"to_date"`
}

type CreateTicketRequest struct {
	Subject    string  `json:"subject" binding:"required"`
	Question   string  `json:"question" binding:"required"`
	FullName   string  `json:"full_name" binding:"required"`
	Email      string  `json:"email" binding:"required,email"`
	Phone      *string `json:"phone,omitempty"`
	TelegramID *string `json:"telegram_id,omitempty"`
	NotifyEmail bool   `json:"notify_email"`
	NotifyTG    bool   `json:"notify_tg"`
}

type UpdateTicketStatusRequest struct {
	Status  TicketStatus `json:"status" binding:"required"`
	Comment *string      `json:"comment,omitempty"`
}

type CreateResponseRequest struct {
	Message string `json:"message" binding:"required"`
} 