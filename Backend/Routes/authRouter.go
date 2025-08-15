package Routes

import (
	"github.com/gin-gonic/gin"
	"Backend/Controllers"
)

func AuthRoute(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/auth/google",Controllers.GoogleLogin())
	incomingRoutes.GET("/auth/callback",Controllers.OAuthCallback())
	incomingRoutes.POST("/auth/token/refresh", Controllers.RefreshAccessToken())
}