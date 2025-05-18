package handlers

import (
	"net/http"

	"ticket-service/internal/models"
	"ticket-service/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type TicketHandler struct {
    svc *services.TicketService
    validate *validator.Validate
}

func NewTicketHandler(svc *services.TicketService) *TicketHandler {
    return &TicketHandler{svc, validator.New()}
}

func (h *TicketHandler) CreateTicket(c *gin.Context) {
    var req struct {
        Title       string `json:"title" validate:"required"`
        Description string `json:"description" validate:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := h.validate.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userIDStr, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    userID, err := uuid.Parse(userIDStr.(string))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    ticketID, presignedURL, err := h.svc.CreateTicket(c.Request.Context(), userID, req.Title, req.Description)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": gin.H{"ticket_id": ticketID, "presigned_url": presignedURL}, "message": "Ticket created"})
}

func (h *TicketHandler) GetTicket(c *gin.Context) {
    id, err := uuid.Parse(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
        return
    }

    ticket, err := h.svc.GetTicket(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": ticket})
}

func (h *TicketHandler) GetUserTickets(c *gin.Context) {
    userIDStr, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    userID, err := uuid.Parse(userIDStr.(string))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    tickets, err := h.svc.GetUserTickets(c.Request.Context(), userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": tickets})
}

func (h *TicketHandler) UpdateTicketStatus(c *gin.Context) {
    id, err := uuid.Parse(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
        return
    }

    role, exists := c.Get("role")
    if !exists || role != "admin" {
        c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
        return
    }

    var req struct {
        Status models.TicketStatus `json:"status" validate:"required,oneof=open in_progress closed rejected"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := h.validate.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.svc.UpdateTicketStatus(c.Request.Context(), id, req.Status); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func (h *TicketHandler) AddAttachment(c *gin.Context) {
    ticketID, err := uuid.Parse(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
        return
    }

    var req struct {
        FileName string `json:"file_name" validate:"required"`
        FileType string `json:"file_type" validate:"required,oneof=pdf jpeg png"`
        FileSize int64  `json:"file_size" validate:"required,gt=0,lte=10485760"` // Max 10MB
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := h.validate.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    presignedURL, err := h.svc.AddAttachment(c.Request.Context(), ticketID, req.FileName, req.FileType, req.FileSize)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": gin.H{"presigned_url": presignedURL}, "message": "Attachment added"})
}

func (h *TicketHandler) AddMessage(c *gin.Context) {
    ticketID, err := uuid.Parse(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
        return
    }

    userIDStr, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    userID, err := uuid.Parse(userIDStr.(string))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var req struct {
        Message string `json:"message" validate:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := h.validate.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.svc.AddMessage(c.Request.Context(), ticketID, userID, req.Message); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Message added"})
}