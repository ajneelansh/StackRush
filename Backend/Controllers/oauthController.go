package Controllers

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

func GoogleLogin() gin.HandlerFunc{
	return func(c *gin.Context) {
		url := Helpers.GoogleOAuthConfig.AuthCodeURL("randomstate")
		c.Redirect(http.StatusFound, url)
       
	}
}

func GithubLogin() gin.HandlerFunc{
	return func(c *gin.Context) {
		url := Helpers.GithubOAuthConfig.AuthCodeURL("randomstate")
		c.Redirect(http.StatusFound, url)
	}
}

func OAuthCallback() gin.HandlerFunc{
	return func(c *gin.Context){
		
	}
}