package services

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"

	"api-gateway/config"
	"api-gateway/middleware"
)

func SetupServices(router *gin.Engine, cfg *config.Config) {
	// Auth Service Routes
	authGroup := router.Group("/api/v1/auth")
	{
		authProxy := createProxy(cfg.AuthService)
		authGroup.POST("/register", authProxy)
		authGroup.POST("/login", authProxy)
		authGroup.GET("/confirm", authProxy)
		authGroup.POST("/password-reset-request", authProxy)
		authGroup.POST("/password-reset-confirm", authProxy)
		authGroup.POST("/verify-2fa", authProxy)
		authGroup.GET("/validate", middleware.AuthMiddleware(cfg), authProxy)
	}

	// News Service Routes
	newsGroup := router.Group("/api/v1/news")
	{
		newsProxy := createProxy(cfg.NewsService)
		// Public routes
		newsGroup.GET("", newsProxy)
		newsGroup.GET("/:id", newsProxy)

		// Admin routes
		adminNews := newsGroup.Group("")
		adminNews.Use(middleware.AuthMiddleware(cfg), middleware.AdminOnly())
		{
			adminNews.POST("", newsProxy)
			adminNews.PUT("/:id", newsProxy)
			adminNews.DELETE("/:id", newsProxy)
		}
	}

	// Ticket Service Routes
	ticketGroup := router.Group("/api/v1/tickets")
	{
		ticketProxy := createProxy(cfg.TicketService)
		// Public routes
		ticketGroup.POST("", ticketProxy)
		ticketGroup.GET("/:id", ticketProxy)

		// Authenticated user routes
		authTickets := ticketGroup.Group("")
		authTickets.Use(middleware.AuthMiddleware(cfg))
		{
			authTickets.GET("/user", ticketProxy)
			authTickets.GET("/user/:id/history", ticketProxy)
		}

		// Admin routes
		adminTickets := ticketGroup.Group("")
		adminTickets.Use(middleware.AuthMiddleware(cfg), middleware.AdminOnly())
		{
			adminTickets.GET("", ticketProxy)
			adminTickets.PUT("/:id/status", ticketProxy)
			adminTickets.GET("/search", ticketProxy)
		}
	}

	// Ticket Responses Routes
	responseGroup := router.Group("/api/v1/responses")
	responseGroup.Use(middleware.AuthMiddleware(cfg), middleware.AdminOnly())
	{
		responseProxy := createProxy(cfg.TicketService)
		responseGroup.POST("/ticket/:id", responseProxy)
		responseGroup.GET("/ticket/:id", responseProxy)
	}
}

func createProxy(service config.ServiceConfig) gin.HandlerFunc {
	target := fmt.Sprintf("http://%s:%s", service.Host, service.Port)
	return func(c *gin.Context) {
		targetURL, err := url.Parse(target)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse target URL"})
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(targetURL)
		proxy.Director = func(req *http.Request) {
			req.URL.Scheme = targetURL.Scheme
			req.URL.Host = targetURL.Host
			req.Host = targetURL.Host

			if userID, exists := c.Get("userID"); exists {
				req.Header.Set("X-User-ID", fmt.Sprint(userID))
			}
			if role, exists := c.Get("role"); exists {
				req.Header.Set("X-User-Role", fmt.Sprint(role))
			}
			if isAdmin, exists := c.Get("isAdmin"); exists {
				req.Header.Set("X-Is-Admin", fmt.Sprint(isAdmin))
			}
			if strings.HasPrefix(c.GetHeader("Content-Type"), "multipart/form-data") {
				form, err := c.MultipartForm()
				if err == nil {
					req.MultipartForm = form
				}
			}
		}

		proxy.ModifyResponse = func(resp *http.Response) error {
			if strings.Contains(resp.Request.URL.Path, "/auth/") {
				for _, cookie := range resp.Cookies() {
					c.SetCookie(cookie.Name, cookie.Value, cookie.MaxAge, cookie.Path,
						cookie.Domain, cookie.Secure, cookie.HttpOnly)
				}
			}
			return nil
		}

		proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
			c.JSON(http.StatusBadGateway, gin.H{"error": "service unavailable"})
		}
		var bodyBytes []byte
		if c.Request.Body != nil {
			bodyBytes, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}

		proxy.ServeHTTP(c.Writer, c.Request)
		if bodyBytes != nil {
			c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}
	}
}
