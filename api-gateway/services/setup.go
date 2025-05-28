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

// @Summary Register new user
// @Description Register a new user in the system
// @Tags auth
// @Accept json
// @Produce json
// @Param input body docs.RegisterRequest true "Registration data"
// @Success 200 {object} docs.APIResponse "Registration successful"
// @Failure 400 {object} docs.ErrorResponse "Invalid input"
// @Router /auth/register [post]

// @Summary User login
// @Description Authenticate user and get access token
// @Tags auth
// @Accept json
// @Produce json
// @Param input body docs.LoginRequest true "Login credentials"
// @Success 200 {object} docs.APIResponse "Login successful"
// @Failure 401 {object} docs.ErrorResponse "Invalid credentials"
// @Router /auth/login [post]

// @Summary Verify 2FA code
// @Description Verify two-factor authentication code
// @Tags auth
// @Accept json
// @Produce json
// @Param input body docs.Verify2FARequest true "2FA verification data"
// @Success 200 {object} docs.APIResponse "2FA verification successful"
// @Failure 400 {object} docs.ErrorResponse "Invalid code"
// @Router /auth/verify-2fa [post]

// @Summary List all users
// @Description Get a list of all users (requires admin privileges)
// @Tags admin
// @Produce json
// @Security BearerAuth
// @Success 200 {array} docs.User "List of users"
// @Failure 401 {object} docs.ErrorResponse "Unauthorized"
// @Failure 403 {object} docs.ErrorResponse "Forbidden"
// @Router /admin/users [get]

// @Summary Get system metrics
// @Description Get system metrics and statistics (requires admin privileges)
// @Tags admin
// @Produce json
// @Security BearerAuth
// @Success 200 {object} docs.Metrics "System metrics"
// @Failure 401 {object} docs.ErrorResponse "Unauthorized"
// @Failure 403 {object} docs.ErrorResponse "Forbidden"
// @Router /admin/metrics [get]

// @Summary Promote user to admin
// @Description Promote a regular user to admin role (requires admin privileges)
// @Tags admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param input body docs.PromoteToAdminRequest true "User ID to promote"
// @Success 200 {object} docs.APIResponse "User promoted successfully"
// @Failure 401 {object} docs.ErrorResponse "Unauthorized"
// @Failure 403 {object} docs.ErrorResponse "Forbidden"
// @Router /admin/promote [post]

// @Summary Delete user
// @Description Delete a user from the system (requires admin privileges)
// @Tags admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param input body docs.DeleteUserRequest true "User ID to delete"
// @Success 200 {object} docs.APIResponse "User deleted successfully"
// @Failure 401 {object} docs.ErrorResponse "Unauthorized"
// @Failure 403 {object} docs.ErrorResponse "Forbidden"
// @Router /admin/users/delete [post]

// @Summary Demote admin to user
// @Description Demote an admin to regular user role (requires root_admin privileges)
// @Tags admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param input body docs.DemoteToUserRequest true "Admin ID to demote"
// @Success 200 {object} docs.APIResponse "Admin demoted successfully"
// @Failure 401 {object} docs.ErrorResponse "Unauthorized"
// @Failure 403 {object} docs.ErrorResponse "Forbidden - requires root_admin"
// @Router /admin/demote [post]

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

	// Admin Routes (from private-service)
	adminGroup := router.Group("/api/v1/admin")
	adminGroup.Use(middleware.AuthMiddleware(cfg))
	{
		adminProxy := createProxy(cfg.AuthService)
		// Routes for both admin and root_admin
		adminGroup.Use(middleware.AdminOnly())
		{
			adminGroup.GET("/users", adminProxy)
			adminGroup.GET("/metrics", adminProxy)
			adminGroup.POST("/promote", adminProxy)
			adminGroup.DELETE("/users/delete", adminProxy)
		}

		// Routes only for root_admin
		rootAdminGroup := adminGroup.Group("")
		rootAdminGroup.Use(middleware.RootAdminOnly())
		{
			rootAdminGroup.POST("/demote", adminProxy)
		}
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
			if isRootAdmin, exists := c.Get("isRootAdmin"); exists {
				req.Header.Set("X-Is-Root-Admin", fmt.Sprint(isRootAdmin))
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
