package docs

// RegisterRequest represents the registration request body
type RegisterRequest struct {
	Email    string `json:"email" example:"user@example.com"`
	Password string `json:"password" example:"strongPassword123"`
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email" example:"user@example.com"`
	Password string `json:"password" example:"strongPassword123"`
}

// Verify2FARequest represents the 2FA verification request
type Verify2FARequest struct {
	Code string `json:"code" example:"123456"`
}

// PromoteToAdminRequest represents the request to promote a user to admin
type PromoteToAdminRequest struct {
	UserID uint `json:"user_id" example:"1"`
}

// DeleteUserRequest represents the request to delete a user
type DeleteUserRequest struct {
	UserID uint `json:"user_id" example:"1"`
}

// DemoteToUserRequest represents the request to demote an admin to user
type DemoteToUserRequest struct {
	AdminID uint `json:"admin_id" example:"1"`
}

// User represents a user in the system
type User struct {
	ID        uint   `json:"id" example:"1"`
	Email     string `json:"email" example:"user@example.com"`
	Role      string `json:"role" example:"user"`
	CreatedAt string `json:"created_at" example:"2024-01-01T00:00:00Z"`
}

// Metrics represents system metrics
type Metrics struct {
	TotalUsers      int `json:"total_users" example:"100"`
	ActiveUsers     int `json:"active_users" example:"50"`
	TotalTickets    int `json:"total_tickets" example:"200"`
	ResolvedTickets int `json:"resolved_tickets" example:"150"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message" example:"Operation completed successfully"`
	Data    interface{} `json:"data,omitempty"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success bool   `json:"success" example:"false"`
	Error   string `json:"error" example:"Invalid input data"`
}

// NewsItem represents a news article
type NewsItem struct {
	ID          uint   `json:"id" example:"1"`
	Title       string `json:"title" example:"Important Update"`
	Content     string `json:"content" example:"Detailed news content..."`
	Author      string `json:"author" example:"Admin Name"`
	PublishedAt string `json:"published_at" example:"2024-01-01T00:00:00Z"`
}

// Ticket represents a support ticket
type Ticket struct {
	ID          uint   `json:"id" example:"1"`
	UserID      uint   `json:"user_id" example:"1"`
	Subject     string `json:"subject" example:"Technical Issue"`
	Description string `json:"description" example:"Detailed description of the issue..."`
	Status      string `json:"status" example:"open"`
	CreatedAt   string `json:"created_at" example:"2024-01-01T00:00:00Z"`
	UpdatedAt   string `json:"updated_at" example:"2024-01-01T00:00:00Z"`
}

// TicketResponse represents a response to a ticket
type TicketResponse struct {
	ID        uint   `json:"id" example:"1"`
	TicketID  uint   `json:"ticket_id" example:"1"`
	AdminID   uint   `json:"admin_id" example:"1"`
	Content   string `json:"content" example:"Response to your ticket..."`
	CreatedAt string `json:"created_at" example:"2024-01-01T00:00:00Z"`
}
