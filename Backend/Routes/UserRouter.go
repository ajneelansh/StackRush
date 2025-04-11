package Routes

import (
	"Backend/Controllers"
	"github.com/gin-gonic/gin"
)

func UserRoute(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/getquestions",Controllers.GetQuestions())
	incomingRoutes.GET("/getquestions:question_id",Controllers.GetQuestionById())
}
