package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"api-gateway/config"
	_ "api-gateway/docs"
	"api-gateway/middleware"
	"api-gateway/services"
	"api-gateway/services/metrics"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// @title ENIC-KZ API Gateway
// @version 1.0
// @description API Gateway for ENIC-KZ microservices
// @host localhost:8085
// @BasePath /api/v1
// @securityDefinitions.apikey BearerAuth
// @in cookie
// @name access_token
// @schemes http https
// @produce json
// @consumes json
func main() {
	// Initialize metrics
	metrics.InitMetrics()

	// Start health checks
	middleware.StartHealthCheck()

	// Start rate limiter cleanup
	middleware.CleanupVisitors()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://enic.kz"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type", "X-Requested-With"},
		AllowCredentials: true,
	}))
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	// Load configuration
	cfg := config.LoadConfig()

	// Set up Gin
	gin.SetMode(gin.ReleaseMode)

	// Add middlewares
	router.Use(middleware.PrometheusMiddleware())
	router.Use(middleware.RateLimiterMiddleware())

	// Initialize services
	services.SetupServices(router, cfg)

	// Setup Swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Metrics endpoint using custom registry
	router.GET("/metrics", gin.WrapH(promhttp.HandlerFor(
		metrics.GetRegistry(),
		promhttp.HandlerOpts{},
	)))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	log.Printf("API Gateway starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
