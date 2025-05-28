package middleware

import (
	"net/http"
	"sync"
	"time"

	"api-gateway/services/metrics"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type ServiceLimiter struct {
	limiter *rate.Limiter
	service string
}

var (
	// Карта для хранения лимитеров по IP
	visitors = make(map[string]*ServiceLimiter)
	mu       sync.RWMutex

	// Настройки лимитов по умолчанию
	defaultRate  = 100 // запросов
	defaultBurst = 50  // всплеск
)

// RateLimiterMiddleware создает middleware для ограничения частоты запросов
func RateLimiterMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		service := GetServiceFromPath(c.FullPath())

		limiter := getVisitor(ip, service)
		if !limiter.limiter.Allow() {
			metrics.RateLimitExceeded.WithLabelValues(service).Inc()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "rate limit exceeded",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// getVisitor создает или возвращает существующий лимитер для IP
func getVisitor(ip, service string) *ServiceLimiter {
	mu.RLock()
	v, exists := visitors[ip]
	if exists {
		mu.RUnlock()
		return v
	}
	mu.RUnlock()

	mu.Lock()
	defer mu.Unlock()

	limiter := &ServiceLimiter{
		limiter: rate.NewLimiter(rate.Limit(defaultRate), defaultBurst),
		service: service,
	}
	visitors[ip] = limiter

	return limiter
}

// CleanupVisitors периодически очищает старые записи
func CleanupVisitors() {
	go func() {
		for {
			time.Sleep(time.Hour) // Очистка каждый час

			mu.Lock()
			visitors = make(map[string]*ServiceLimiter)
			mu.Unlock()
		}
	}()
}
