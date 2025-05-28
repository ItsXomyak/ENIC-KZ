package middleware

import (
	"strconv"
	"time"

	"api-gateway/services/metrics"

	"github.com/gin-gonic/gin"
)

// PrometheusMiddleware добавляет метрики Prometheus для запросов API Gateway
func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.FullPath()
		if path == "" {
			path = "unknown"
		}

		// Определяем сервис на основе пути
		service := GetServiceFromPath(path)

		c.Next()

		// Записываем метрики после обработки запроса
		duration := time.Since(start).Seconds()
		status := strconv.Itoa(c.Writer.Status())

		// Увеличиваем счетчик запросов
		metrics.GatewayRequestsTotal.WithLabelValues(
			service,
			c.Request.Method,
			path,
			status,
		).Inc()

		// Записываем время выполнения запроса
		metrics.GatewayRequestDuration.WithLabelValues(
			service,
			c.Request.Method,
			path,
		).Observe(duration)

		// Если произошла ошибка, увеличиваем счетчик ошибок
		if c.Writer.Status() >= 400 {
			errorType := getErrorType(c.Writer.Status())
			metrics.ErrorsTotal.WithLabelValues(service, errorType).Inc()
		}
	}
}

// getErrorType возвращает тип ошибки на основе статус-кода
func getErrorType(status int) string {
	switch {
	case status == 400:
		return "bad_request"
	case status == 401:
		return "unauthorized"
	case status == 403:
		return "forbidden"
	case status == 404:
		return "not_found"
	case status == 429:
		return "rate_limit_exceeded"
	case status >= 500:
		return "server_error"
	default:
		return "unknown"
	}
}
