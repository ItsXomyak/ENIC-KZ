package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"news-service/internal/logger"
	"news-service/internal/models"
	"news-service/internal/service"
)

type NewsHandler struct {
	service service.NewsService
}

// GetAll godoc
// @Summary      Получить список новостей
// @Description  Возвращает список новостей с поддержкой фильтров: категория, дата, пагинация.
// @Tags         news
// @Accept       json
// @Produce      json
// @Param        category  query     string  false  "Код категории (например, general, education)"
// @Param        from      query     string  false  "Начальная дата публикации (формат: YYYY-MM-DD)"
// @Param        to        query     string  false  "Конечная дата публикации (формат: YYYY-MM-DD)"
// @Param        limit     query     int     false  "Максимальное количество новостей (по умолчанию 10)"
// @Param        offset    query     int     false  "Смещение от начала (по умолчанию 0)"
// @Success      200       {array}   models.News
// @Failure      500       {object}  map[string]string
// @Router       /news [get]
func (h *NewsHandler) GetAll(c *gin.Context) {
	ctx := c.Request.Context()

	category := c.Query("category")
	fromStr := c.Query("from")
	toStr := c.Query("to")
	limit := 10
	offset := 0
	if l := c.Query("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil {
			limit = v
		}
	}
	if o := c.Query("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil {
			offset = v
		}
	}
	var dateFrom, dateTo time.Time
	if fromStr != "" {
		if t, err := time.Parse("2006-01-02", fromStr); err == nil {
			dateFrom = t
		}
	}
	if toStr != "" {
		if t, err := time.Parse("2006-01-02", toStr); err == nil {
			dateTo = t
		}
	}

	newsList, err := h.service.GetAll(ctx, category, dateFrom, dateTo, limit, offset)
	if err != nil {
		logger.Error("GetAll failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch news"})
		return
	}
	c.JSON(http.StatusOK, newsList)
}

// GetByID godoc
// @Summary      Получить новость по ID
// @Description  Возвращает одну новость по её UUID
// @Tags         news
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "UUID новости"
// @Success      200  {object}  models.News
// @Failure      404  {object}  map[string]string
// @Router       /news/{id} [get]
func (h *NewsHandler) GetByID(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	n, err := h.service.GetByID(ctx, id)
	if err != nil {
		logger.Error("GetByID failed: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "news not found"})
		return
	}
	c.JSON(http.StatusOK, n)
}

// Create godoc
// @Summary      Создать новость
// @Description  Создаёт новую новость с переводами и категорией
// @Tags         news
// @Accept       json
// @Produce      json
// @Param        news  body      models.News  true  "Данные новости"
// @Success      201   {object}  models.News
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /news [post]
func (h *NewsHandler) Create(c *gin.Context) {
	ctx := c.Request.Context()
	var input models.News
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Error("Create bind JSON failed: ", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	created, err := h.service.Create(ctx, &input)
	if err != nil {
		logger.Error("Create failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create news"})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// Update godoc
// @Summary      Обновить новость
// @Description  Обновляет существующую новость по её ID
// @Tags         news
// @Accept       json
// @Produce      json
// @Param        id    path      string      true  "UUID новости"
// @Param        news  body      models.News  true  "Обновлённые данные новости"
// @Success      200   {object}  models.News
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /news/{id} [put]
func (h *NewsHandler) Update(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")
	var input models.News
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Error("Update bind JSON failed: ", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	parsedID, _ := uuid.Parse(id)
	input.ID = parsedID

	updated, err := h.service.Update(ctx, &input)
	if err != nil {
		logger.Error("Update failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update news"})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// Delete godoc
// @Summary      Удалить новость
// @Description  Удаляет новость по её UUID
// @Tags         news
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "UUID новости"
// @Success      204  {string}  string  "No Content"
// @Failure      500  {object}  map[string]string
// @Router       /news/{id} [delete]
func (h *NewsHandler) Delete(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")
	if err := h.service.Delete(ctx, id); err != nil {
		logger.Error("Delete failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete news"})
		return
	}
	c.Status(http.StatusNoContent)
}
