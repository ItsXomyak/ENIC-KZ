package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/services"
	"ticket-service/internal/logger"
)

type TicketHandler struct {
	ticketService *services.TicketService
}

func NewTicketHandler(ticketService *services.TicketService) *TicketHandler {
	return &TicketHandler{
		ticketService: ticketService,
	}
}

// CreateTicket создает новый тикет
// @Summary Создать новый тикет
// @Description Создает новый тикет с возможностью прикрепления файла
// @Tags tickets
// @Accept json
// @Produce json
// @Param request body models.CreateTicketRequest true "Данные тикета"
// @Success 201 {object} models.Ticket
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets [post]
func (h *TicketHandler) CreateTicket(c *gin.Context) {
	var req models.CreateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Error("Failed to bind request", "error", err)
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request format"})
		return
	}

	// Проверяем авторизацию
	userID, exists := c.Get("userID")
	if !exists {
		// Неавторизованный пользователь
		if req.Email == "" {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "email is required for guests"})
			return
		}
		if !isValidEmail(req.Email) {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid email format"})
			return
		}
	}

	if req.Subject == "" || req.Question == "" || req.FullName == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "subject, question and full_name are required"})
		return
	}

	// Создаём тикет
	ticket := &models.Ticket{
		Subject:    req.Subject,
		Question:   req.Question,
		Email:      req.Email,
		FullName:   req.FullName,
		Phone:      req.Phone,
		NotifyEmail: req.NotifyEmail,
		NotifyTG:   req.NotifyTG,
		Status:     models.TicketStatusNew,
	}

	if exists {
		ticket.UserID = userID.(int64)
		// Для авторизованных пользователей всегда включаем уведомления
		ticket.NotifyEmail = true
	}

	// Сохраняем тикет
	if err := h.ticketService.CreateTicket(c.Request.Context(), ticket, nil); err != nil {
		logger.Error("Failed to create ticket", "error", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, ticket)
}

// isValidEmail проверяет корректность формата email
func isValidEmail(email string) bool {
	// Простая проверка формата email
	if len(email) < 3 || len(email) > 254 {
		return false
	}
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return false
	}
	return true
}

// GetTicket получает тикет по ID
// @Summary Получить тикет
// @Description Получает информацию о тикете по его ID
// @Tags tickets
// @Produce json
// @Param id path int true "ID тикета"
// @Success 200 {object} models.Ticket
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets/{id} [get]
func (h *TicketHandler) GetTicket(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid ticket ID"})
		return
	}

	ticket, err := h.ticketService.GetTicket(c.Request.Context(), id)
	if err != nil {
		logger.Error("Failed to get ticket", "error", err, "ticketID", id)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	if ticket == nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "ticket not found"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

// GetUserTickets получает тикеты пользователя
// @Summary Получить тикеты пользователя
// @Description Получает список тикетов текущего пользователя
// @Tags tickets
// @Produce json
// @Param page query int false "Номер страницы"
// @Param page_size query int false "Размер страницы"
// @Success 200 {object} []models.Ticket
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets/user [get]
func (h *TicketHandler) GetUserTickets(c *gin.Context) {
	userID := c.GetInt64("userID")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "unauthorized"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	req := models.GetTicketsRequest{
		Page:     page,
		PageSize: pageSize,
	}

	tickets, total, err := h.ticketService.GetUserTickets(c.Request.Context(), userID, req)
	if err != nil {
		logger.Error("Failed to get user tickets", "error", err, "userID", userID)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tickets": tickets,
		"total":   total,
	})
}

// GetAllTickets получает все тикеты (только для админов)
// @Summary Получить все тикеты
// @Description Получает список всех тикетов (только для администраторов)
// @Tags tickets
// @Produce json
// @Param page query int false "Номер страницы"
// @Param page_size query int false "Размер страницы"
// @Success 200 {object} []models.Ticket
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets [get]
func (h *TicketHandler) GetAllTickets(c *gin.Context) {
	if !c.GetBool("isAdmin") {
		c.JSON(http.StatusForbidden, ErrorResponse{Error: "access denied"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	req := models.GetTicketsRequest{
		Page:     page,
		PageSize: pageSize,
	}

	tickets, total, err := h.ticketService.GetAllTickets(c.Request.Context(), req)
	if err != nil {
		logger.Error("Failed to get all tickets", "error", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tickets": tickets,
		"total":   total,
	})
}

// UpdateTicketStatus обновляет статус тикета (только для админов)
// @Summary Обновить статус тикета
// @Description Обновляет статус тикета (только для администраторов)
// @Tags tickets
// @Accept json
// @Produce json
// @Param id path int true "ID тикета"
// @Param request body UpdateStatusRequest true "Данные для обновления"
// @Success 200 {object} models.Ticket
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets/{id}/status [put]
func (h *TicketHandler) UpdateTicketStatus(c *gin.Context) {
	if !c.GetBool("isAdmin") {
		c.JSON(http.StatusForbidden, ErrorResponse{Error: "access denied"})
		return
	}

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid ticket ID"})
		return
	}

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	adminID := c.GetInt64("userID")
	if err := h.ticketService.UpdateTicketStatus(c.Request.Context(), id, req.Status, adminID, req.Comment); err != nil {
		logger.Error("Failed to update ticket status", "error", err, "ticketID", id)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "status updated successfully"})
}

// SearchTickets ищет тикеты (только для админов)
// @Summary Поиск тикетов
// @Description Поиск тикетов по запросу (только для администраторов)
// @Tags tickets
// @Produce json
// @Param query query string true "Поисковый запрос"
// @Param page query int false "Номер страницы"
// @Param page_size query int false "Размер страницы"
// @Success 200 {object} []models.Ticket
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets/search [get]
func (h *TicketHandler) SearchTickets(c *gin.Context) {
	if !c.GetBool("isAdmin") {
		c.JSON(http.StatusForbidden, ErrorResponse{Error: "access denied"})
		return
	}

	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "search query is required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	req := models.GetTicketsRequest{
		Page:     page,
		PageSize: pageSize,
	}

	tickets, total, err := h.ticketService.SearchTickets(c.Request.Context(), query, req)
	if err != nil {
		logger.Error("Failed to search tickets", "error", err, "query", query)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tickets": tickets,
		"total":   total,
	})
}

// GetTicketHistory получает историю тикета
// @Summary Получить историю тикета
// @Description Получает историю изменений тикета
// @Tags tickets
// @Produce json
// @Param id path int true "ID тикета"
// @Success 200 {object} []models.TicketHistory
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /tickets/{id}/history [get]
func (h *TicketHandler) GetTicketHistory(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid ticket ID"})
		return
	}

	history, err := h.ticketService.GetTicketHistory(c.Request.Context(), id)
	if err != nil {
		logger.Error("Failed to get ticket history", "error", err, "ticketID", id)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, history)
}

// ErrorResponse представляет структуру ответа с ошибкой
type ErrorResponse struct {
	Error string `json:"error"`
}

// UpdateStatusRequest представляет структуру запроса на обновление статуса
type UpdateStatusRequest struct {
	Status  models.TicketStatus `json:"status" binding:"required"`
	Comment *string            `json:"comment,omitempty"`
} 