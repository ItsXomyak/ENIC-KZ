package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"
)

// RateLimiterConfig конфигурация для rate limiter
type RateLimiterConfig struct {
	RequestsPerMinute int
	BurstSize         int
}

// RateLimiter middleware для ограничения количества запросов
func RateLimiter(redisClient *redis.Client, config RateLimiterConfig) gin.HandlerFunc {
	// Создаем rate limiter для каждого IP
	limiters := make(map[string]*rate.Limiter)

	return func(c *gin.Context) {
		ip := c.ClientIP()

		// Получаем или создаем limiter для IP
		limiter, exists := limiters[ip]
		if !exists {
			limiter = rate.NewLimiter(rate.Limit(config.RequestsPerMinute)/60, config.BurstSize)
			limiters[ip] = limiter
		}

		// Проверяем, не превышен ли лимит
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RedisRateLimiter middleware для ограничения количества запросов с использованием Redis
func RedisRateLimiter(redisClient *redis.Client, config RateLimiterConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := "rate_limit:" + ip

		// Увеличиваем счетчик запросов
		count, err := redisClient.Incr(c.Request.Context(), key).Result()
		if err != nil {
			// Пропускаем запрос в случае ошибки Redis
			c.Next()
			return
		}

		// Устанавливаем TTL для ключа (1 минута)
		if count == 1 {
			redisClient.Expire(c.Request.Context(), key, time.Minute)
		}

		// Проверяем, не превышен ли лимит
		if count > int64(config.RequestsPerMinute) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
