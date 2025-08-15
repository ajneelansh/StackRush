package Middleware

import (
	"Backend/Helpers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			log.Println("AuthMiddleware: Access token cookie not found.")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required: Access token missing."})
			c.Abort()
			return
		}

		claims, err := Helpers.ValidateAccessToken(accessToken)
		if err != nil {
			log.Printf("AuthMiddleware: Invalid or expired access token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required: Invalid or expired access token."})
			c.Abort() 
			return
		}

		c.Set("user_id", claims.UserID)
		

		c.Next()
	}
}