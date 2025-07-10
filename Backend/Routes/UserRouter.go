package Routes

import (
	"Backend/Controllers"
	Middleware "Backend/Middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoute(incomingRoutes *gin.Engine){
	incomingRoutes.Use(Middleware.RequireAuth())
	incomingRoutes.GET("/getquestions",Controllers.GetQuestions())
	incomingRoutes.GET("/getquestions:question_id",Controllers.GetQuestionById())
	incomingRoutes.GET("/getprogress",Controllers.GetProgressData())
	incomingRoutes.POST("/incrementheatmap", Controllers.IncrementHeatmapData())
	incomingRoutes.GET("/getheatmap", Controllers.GetHeatmap())
	incomingRoutes.GET("/getuser", Controllers.GetUserInfo())
	incomingRoutes.POST("/updatequestionstatus", Controllers.UpdateQuestionStatus())
	incomingRoutes.POST("/updateprofile", Controllers.UpdateProfile())
	incomingRoutes.POST("/verify", Controllers.VerifySubmission())
}
