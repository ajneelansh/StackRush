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
	incomingRoutes.POST("/updatequestionstatus", Controllers.UpdateQuestionStatus())
}
