package middleware

import (
	"net/http"
	"ticket-service/internal/clients/auth"

	"github.com/gin-gonic/gin"
)

func Auth(authClient *auth.Client) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        userID, role, err := authClient.ValidateToken(c.Request.Context(), token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        c.Set("user_id", userID)
        c.Set("role", role)
        c.Next()
    }
}

func AdminOnly(authClient *auth.Client) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        userID, role, err := authClient.ValidateToken(c.Request.Context(), token)
        if err != nil || role != "admin" {
            c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
            c.Abort()
            return
        }

        c.Set("user_id", userID)
        c.Set("role", role)
        c.Next()
    }
}	