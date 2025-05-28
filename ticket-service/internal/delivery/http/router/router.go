package router

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"ticket-service/internal/delivery/http/handlers"
	"ticket-service/internal/delivery/http/middleware"
)

// SetupRouter настраивает маршруты приложения
func SetupRouter(
	ticketHandler *handlers.TicketHandler,
	responseHandler *handlers.ResponseHandler,
	redisClient *redis.Client,
) *gin.Engine {
	// Используем gin.New() вместо gin.Default() чтобы убрать стандартные логи
	router := gin.New()

	// Добавляем только recovery middleware для обработки паник
	router.Use(gin.Recovery())

	// Добавляем Prometheus middleware
	router.Use(middleware.PrometheusMiddleware())

	// Добавляем rate limiter
	rateLimiterConfig := middleware.RateLimiterConfig{
		RequestsPerMinute: 60, // 1 запрос в секунду
		BurstSize:         10, // Разрешаем до 10 запросов одновременно
	}
	router.Use(middleware.RedisRateLimiter(redisClient, rateLimiterConfig))

	// Эндпоинт для метрик Prometheus
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Swagger documentation
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Публичные маршруты
	public := router.Group("/api/v1")
	{
		// Документация API
		public.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

		// Маршруты для тикетов
		tickets := public.Group("/tickets")
		{
			// Публичные маршруты
			tickets.POST("", ticketHandler.CreateTicket)
			tickets.GET("/:id", ticketHandler.GetTicket)

			// Защищенные маршруты
			auth := tickets.Group("")
			auth.Use(middleware.AuthMiddleware())
			{
				auth.GET("/user", ticketHandler.GetUserTickets)
				auth.GET("/user/:id/history", ticketHandler.GetTicketHistory)
			}

			// Маршруты только для админов
			admin := tickets.Group("")
			admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly())
			{
				admin.GET("", ticketHandler.GetAllTickets)
				admin.PUT("/:id/status", ticketHandler.UpdateTicketStatus)
				admin.GET("/search", ticketHandler.SearchTickets)
			}
		}

		// Маршруты для ответов
		responses := public.Group("/responses")
		responses.Use(middleware.AuthMiddleware(), middleware.AdminOnly())
		{
			responses.POST("/ticket/:id", responseHandler.CreateResponse)
			responses.GET("/ticket/:id", responseHandler.GetTicketResponses)
		}
	}

	return router
}
