package handler

import (
	"news-service/internal/service"

	"github.com/gin-gonic/gin"
)

func RegisterNewsRoutes(r *gin.RouterGroup, svc service.NewsService) {
	h := &NewsHandler{service: svc}

	r.GET("/", h.GetAll)
	r.GET("/:id", h.GetByID)

	a := r.Group("")
	a.POST("/", h.Create)
	a.PUT("/:id", h.Update)
	a.DELETE("/:id", h.Delete)
}
