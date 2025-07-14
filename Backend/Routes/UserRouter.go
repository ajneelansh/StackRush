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
	incomingRoutes.GET("/getheatmap", Controllers.GetHeatmap())
	incomingRoutes.GET("/getuser", Controllers.GetUserInfo())
	incomingRoutes.POST("/updateprofile", Controllers.UpdateProfile())
	incomingRoutes.POST("/verify", Controllers.VerifySubmission())
	incomingRoutes.GET("/gettopics", Controllers.FetchTopics())
	incomingRoutes.GET("/getpatterns", Controllers.FetchPatternsByTopic())
	incomingRoutes.GET("/gettopicwisequestions", Controllers.FetchTopicWiseSheetsByPattern())
	incomingRoutes.GET("/gettopicwiseprogress", Controllers.FetchUserTopicWiseStats())
	incomingRoutes.POST("/verifytopicwise", Controllers.VerifySubmissionTopicwise())
}

// PublicUserRoute should be registered on the main router *before* applying RequireAuth middleware to other routes.
func PublicUserRoute(ig *gin.Engine){
	ig.GET("/getuserbyusername", Controllers.GetUserByUsername())
	ig.GET("/getheatmapbyusername", Controllers.GetHeatmapByUsername())
}


