package models

import (
	"time"
)

type TicketStatus string

const (
	StatusNew       TicketStatus = "new"
	StatusPending   TicketStatus = "pending"
	StatusApproved  TicketStatus = "approved"
	StatusRejected  TicketStatus = "rejected"
	StatusCancelled TicketStatus = "cancelled"
)

type Ticket struct {
	ID           string       `json:"id" db:"id"`
	UserID       string       `json:"user_id" db:"user_id"`
	FullName     string       `json:"full_name" db:"full_name"`
	Email        string       `json:"email" db:"email"`
	PhoneNumber  *string      `json:"phone_number" db:"phone_number"`
	TelegramID   *string      `json:"telegram_id" db:"telegram_id"`
	Question     string       `json:"question" db:"question"`
	DocumentType string       `json:"document_type" db:"document_type"`
	Country      string       `json:"country" db:"country"`
	FileURL      *string      `json:"file_url" db:"file_url"`
	Status       TicketStatus `json:"status" db:"status"`
	CreatedAt    time.Time    `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at" db:"updated_at"`
}

type TicketResponse struct {
	ID        string       `json:"id" db:"id"`
	TicketID  string       `json:"ticket_id" db:"ticket_id"`
	AdminID   *string      `json:"admin_id" db:"admin_id"`
	Status    TicketStatus `json:"status" db:"status"`
	Comment   *string      `json:"comment" db:"comment"`
	FileURL   *string      `json:"file_url" db:"file_url"`
	CreatedAt time.Time    `json:"created_at" db:"created_at"`
}

type CreateTicketRequest struct {
	FullName     string  `json:"full_name" binding:"required,min=2,max=255"`
	Email        string  `json:"email" binding:"required,email"`
	PhoneNumber  *string `json:"phone_number" binding:"omitempty,max=20"`
	TelegramID   *string `json:"telegram_id" binding:"omitempty,max=50"`
	Question     string  `json:"question" binding:"required,min=10"`
	DocumentType string  `json:"document_type" binding:"required,oneof=diploma certificate passport license transcript"`
	Country      string  `json:"country" binding:"required,len=2"`
	RecaptchaToken string `json:"recaptcha_token" binding:"required"`
}

type CreateTicketResponse struct {
	TicketID     string `json:"ticket_id"`
	PresignedURL string `json:"presigned_url"`
	Status       string `json:"status"`
}

type UpdateTicketStatusRequest struct {
	Status  TicketStatus `json:"status" binding:"required,oneof=new pending approved rejected cancelled"`
	Comment *string      `json:"comment" binding:"omitempty,max=1000"`
	FileURL *string      `json:"file_url" binding:"omitempty,url,max=512"`
}

type ListTicketsRequest struct {
	Status       *string `form:"status" binding:"omitempty,oneof=new pending approved rejected cancelled"`
	CreatedAfter *string `form:"created_after" binding:"omitempty,datetime=2006-01-02"`
	Page         int     `form:"page" binding:"min=1"`
	Limit        int     `form:"limit" binding:"min=1,max=100"`
}

type Pagination struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Total int `json:"total"`
}

type ListTicketsResponse struct {
	Tickets    []Ticket   `json:"tickets"`
	Pagination Pagination `json:"pagination"`
}