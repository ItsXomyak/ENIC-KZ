package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"

	"ticket-service/logger"
	"ticket-service/models"
)

// TicketService определяет интерфейс для сервиса тикетов
type TicketService interface {
	CreateTicket(ctx context.Context, req models.CreateTicketRequest, userID string) (models.CreateTicketResponse, error)
	GetTicket(ctx context.Context, id string, userID string) (*models.Ticket, error)
	ListTickets(ctx context.Context, userID string, params models.ListTicketsRequest) (models.ListTicketsResponse, error)
	UpdateTicketStatus(ctx context.Context, ticketID string, req models.UpdateTicketStatusRequest, adminID string) error
}

// CreateTicket обрабатывает создание нового тикета
func CreateTicket(svc TicketService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.CreateTicketRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			logger.Error("Failed to bind request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			logger.Error("UserID not found in context")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		userIDStr, ok := userID.(string)
		if !ok || userIDStr == "" {
			logger.Error("Invalid userID format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid userID"})
			return
		}

		resp, err := svc.CreateTicket(c.Request.Context(), req, userIDStr)
		if err != nil {
			logger.Error("Failed to create ticket:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, resp)
	}
}

// GetTicket обрабатывает получение тикета по ID
func GetTicket(svc TicketService) gin.HandlerFunc {
	return func(c *gin.Context) {
		ticketID := c.Param("id")
		if ticketID == "" {
			logger.Error("Ticket ID is empty")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ticket ID is required"})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			logger.Error("UserID not found in context")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		userIDStr, ok := userID.(string)
		if !ok || userIDStr == "" {
			logger.Error("Invalid userID format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid userID"})
			return
		}

		ticket, err := svc.GetTicket(c.Request.Context(), ticketID, userIDStr)
		if err != nil {
			logger.Error("Failed to get ticket:", err)
			if err.Error() == "unauthorized access to ticket" {
				c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized access to ticket"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		c.JSON(http.StatusOK, ticket)
	}
}

// ListTickets обрабатывает получение списка тикетов пользователя
func ListTickets(svc TicketService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var params models.ListTicketsRequest
		if err := c.ShouldBindQuery(&params); err != nil {
			logger.Error("Failed to bind query params:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameters"})
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			logger.Error("UserID not found in context")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		userIDStr, ok := userID.(string)
		if !ok || userIDStr == "" {
			logger.Error("Invalid userID format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid userID"})
			return
		}

		resp, err := svc.ListTickets(c.Request.Context(), userIDStr, params)
		if err != nil {
			logger.Error("Failed to list tickets:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, resp)
	}
}

// UpdateTicketStatus обрабатывает обновление статуса тикета (для админов)
func UpdateTicketStatus(svc TicketService) gin.HandlerFunc {
	return func(c *gin.Context) {
		ticketID := c.Param("id")
		if ticketID == "" {
			logger.Error("Ticket ID is empty")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ticket ID is required"})
			return
		}

		var req models.UpdateTicketStatusRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			logger.Error("Failed to bind request:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		adminID, exists := c.Get("adminID")
		if !exists {
			logger.Error("AdminID not found in context")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		adminIDStr, ok := adminID.(string)
		if !ok || adminIDStr == "" {
			logger.Error("Invalid adminID format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid adminID"})
			return
		}

		err := svc.UpdateTicketStatus(c.Request.Context(), ticketID, req, adminIDStr)
		if err != nil {
			logger.Error("Failed to update ticket status:", err)
			if err.Error() == "ticket not found" {
				c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Ticket status updated"})
	}
}