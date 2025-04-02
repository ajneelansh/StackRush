package Routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ajneelansh/StackRush/Controllers"
)


func routes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/auth/google",Controllers.GoogleLogin)
	incomingRoutes.GET("auth/github",Controllers.GithubLogin)
	incomingRoutes.GET("/auth/callback",Controllers.GoogleCallback)
}