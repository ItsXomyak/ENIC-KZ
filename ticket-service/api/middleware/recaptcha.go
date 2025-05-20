package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"ticket-service/config"
	"ticket-service/logger"
)

// ReCAPTCHAResponse представляет ответ от Google reCAPTCHA API
type ReCAPTCHAResponse struct {
	Success     bool     `json:"success"`
	Score       float32  `json:"score"`
	Action      string   `json:"action"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes"`
}

// ReCAPTCHAMiddleware проверяет reCAPTCHA v3 токен
func ReCAPTCHAMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Пропускаем middleware для всех эндпоинтов, кроме POST /api/tickets
		if c.Request.Method != http.MethodPost || c.Request.URL.Path != "/api/tickets" {
			c.Next()
			return
		}

		// Извлекаем тело запроса
		var body map[string]interface{}
		if err := c.ShouldBindJSON(&body); err != nil {
			logger.Error("Failed to bind JSON body:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			c.Abort()
			return
		}

		// Проверяем наличие recaptcha_token
		token, ok := body["recaptcha_token"].(string)
		if !ok || token == "" {
			logger.Error("Missing or invalid recaptcha_token")
			c.JSON(http.StatusBadRequest, gin.H{"error": "reCAPTCHA token is required"})
			c.Abort()
			return
		}

		// Формируем запрос к Google reCAPTCHA API
		payload := map[string]string{
			"secret": cfg.ReCAPTCHASecret,
			"response": token,
			"remoteip": c.ClientIP(),
		}
		payloadBytes, err := json.Marshal(payload)
		if err != nil {
			logger.Error("Failed to marshal reCAPTCHA payload:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			c.Abort()
			return
		}

		// Отправляем запрос к Google API
		resp, err := http.Post("https://www.google.com/recaptcha/api/siteverify", "application/json", bytes.NewBuffer(payloadBytes))
		if err != nil {
			logger.Error("Failed to verify reCAPTCHA:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify reCAPTCHA"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		// Декодируем ответ
		var recaptchaResp ReCAPTCHAResponse
		if err := json.NewDecoder(resp.Body).Decode(&recaptchaResp); err != nil {
			logger.Error("Failed to decode reCAPTCHA response:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process reCAPTCHA response"})
			c.Abort()
			return
		}

		// Проверяем успешность и оценку
		if !recaptchaResp.Success {
			logger.Error("reCAPTCHA verification failed:", recaptchaResp.ErrorCodes)
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("reCAPTCHA verification failed: %v", recaptchaResp.ErrorCodes)})
			c.Abort()
			return
		}

		// Проверяем score (порог 0.5 для reCAPTCHA v3)
		if recaptchaResp.Score < 0.5 {
			logger.Warn("reCAPTCHA score too low:", recaptchaResp.Score)
			c.JSON(http.StatusBadRequest, gin.H{"error": "reCAPTCHA score too low"})
			c.Abort()
			return
		}

		// Проверяем action (опционально, если вы используете action в reCAPTCHA)
		if recaptchaResp.Action != "create_ticket" {
			logger.Warn("Invalid reCAPTCHA action:", recaptchaResp.Action)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reCAPTCHA action"})
			c.Abort()
			return
		}

		// Токен валиден, продолжаем обработку запроса
		c.Next()
	}
}	