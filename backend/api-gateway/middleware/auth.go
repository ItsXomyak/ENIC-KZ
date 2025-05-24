package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"api-gateway/config"
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
}

const (
	RoleUser      = "user"
	RoleAdmin     = "admin"
	RoleRootAdmin = "root_admin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: missing token"})
			c.Abort()
			return
		}

		authURL := fmt.Sprintf("http://%s:%s/api/v1/auth/validate", cfg.AuthService.Host, cfg.AuthService.Port)
		req, _ := http.NewRequest("GET", authURL, nil)
		req.AddCookie(&http.Cookie{Name: "access_token", Value: accessToken})

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to validate token"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid token"})
			c.Abort()
			return
		}

		var claims Claims
		if err := json.NewDecoder(resp.Body).Decode(&claims); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse claims"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Set("isAdmin", claims.Role == RoleAdmin || claims.Role == RoleRootAdmin)
		c.Set("isRootAdmin", claims.Role == RoleRootAdmin)

		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin, exists := c.Get("isAdmin")
		if !exists || !isAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied: admin only"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func RootAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		isRootAdmin, exists := c.Get("isRootAdmin")
		if !exists || !isRootAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied: root admin only"})
			c.Abort()
			return
		}
		c.Next()
	}
}
