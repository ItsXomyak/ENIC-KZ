package middleware

import (
	"strconv"
	"time"

	"ticket-service/internal/infrastructure/metrics"

	"github.com/gin-gonic/gin"
)

// PrometheusMiddleware добавляет метрики Prometheus для HTTP запросов
func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.FullPath()
		if path == "" {
			path = "unknown"
		}

		c.Next()

		duration := time.Since(start).Seconds()
		status := strconv.Itoa(c.Writer.Status())

		// Увеличиваем счетчик запросов
		metrics.HTTPRequestsTotal.WithLabelValues(c.Request.Method, path, status).Inc()
		
		// Записываем время выполнения запроса
		metrics.HTTPRequestDuration.WithLabelValues(c.Request.Method, path).Observe(duration)
	}
} 