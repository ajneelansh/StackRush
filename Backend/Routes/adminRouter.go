package Routes

import(
"Backend/Controllers"
"github.com/gin-gonic/gin"

)

func AdminRoutes(incomingRoutes *gin.Engine){
     incomingRoutes.POST("/postquestions",Controllers.UploadQuestions())
}