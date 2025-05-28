package handlers

import (
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"ticket-service/internal/domain/models"
	"ticket-service/internal/domain/services"
	"ticket-service/internal/logger"
)

type ResponseHandler struct {
	responseService *services.ResponseService
}

func NewResponseHandler(responseService *services.ResponseService) *ResponseHandler {
	return &ResponseHandler{
		responseService: responseService,
	}
}

// CreateResponse создает новый ответ на тикет
// @Summary Создать ответ на тикет
// @Description Создает новый ответ на тикет (только для администраторов)
// @Tags responses
// @Accept multipart/form-data
// @Produce json
// @Param id path int true "ID тикета"
// @Param message formData string true "Сообщение"
// @Param file formData file false "Прикрепленный файл"
// @Success 201 {object} models.Response
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /responses/ticket/{id} [post]
func (h *ResponseHandler) CreateResponse(c *gin.Context) {
	ticketID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid ticket ID"})
		return
	}

	message := c.PostForm("message")
	if message == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "message is required"})
		return
	}

	file, _ := c.FormFile("file")
	var fileReader io.Reader
	if file != nil {
		openedFile, err := file.Open()
		if err != nil {
			logger.Error("Failed to open file", "error", err)
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to process file"})
			return
		}
		defer openedFile.Close()
		fileReader = openedFile
	}

	adminID := c.GetInt64("userID")
	response := &models.Response{
		TicketID: ticketID,
		AdminID:  adminID,
		Message:  message,
	}

	if err := h.responseService.CreateResponse(c.Request.Context(), response, fileReader); err != nil {
		logger.Error("Failed to create response", "error", err, "ticketID", ticketID)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetTicketResponses получает все ответы на тикет
// @Summary Получить ответы на тикет
// @Description Получает список всех ответов на тикет (только для администраторов)
// @Tags responses
// @Produce json
// @Param id path int true "ID тикета"
// @Success 200 {object} []models.Response
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /responses/ticket/{id} [get]
func (h *ResponseHandler) GetTicketResponses(c *gin.Context) {
	ticketID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid ticket ID"})
		return
	}

	responses, err := h.responseService.GetTicketResponses(c.Request.Context(), ticketID)
	if err != nil {
		logger.Error("Failed to get ticket responses", "error", err, "ticketID", ticketID)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, responses)
} 