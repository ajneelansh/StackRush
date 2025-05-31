package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetQuestions() gin.HandlerFunc{
	return func(c *gin.Context){
          minRatingstr := c.Query("minRating")
		  maxRatingstr := c.Query("maxRating")
		  page, err:= strconv.Atoi(c.DefaultQuery("page","1"))
		  if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid page"})
		   }
		  limit, err:= strconv.Atoi(c.DefaultQuery("limit","10"))
		  if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid page"})
		   }

		  minRating, err := strconv.Atoi(minRatingstr)
		   if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid minRating"})
		   }
		  maxRating,err:= strconv.Atoi(maxRatingstr)
		  if err != nil{
			c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid maxRating"})
		  }
	  
		  offset := (page - 1) * limit

		  var questions []Models.Questions

		  result :=Database.DB.Where("rating BETWEEN ? AND ?",minRating,maxRating).
		  Order("rating ASC").
		  Offset(offset).
		  Limit(limit).
		  Select("question_id","question_title","link"). 
		  Find(&questions)

		  if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		   }
	
		   c.JSON(http.StatusOK, gin.H{
			"questions": questions,
			"hasMore": len(questions) == limit,
		  })
	}
}


func GetProgressData() gin.HandlerFunc {
	return func(c *gin.Context){
		var progressData []Models.UserStats
		userId := c.Query("user_id")
		result := Database.DB.Model(&Models.UserStats{}).
			Where("user_id = ?", userId).
			Find(&progressData)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(http.StatusOK, progressData)
	}
}

func GetQuestionById() gin.HandlerFunc{
	return func(c *gin.Context){

		  var question Models.Questions
          questionId := c.Param("question_id")

		  result := Database.DB.Where("question_id = ?",questionId).Find(&question)

		  if result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
			return
		  }
	

		  c.JSON(http.StatusAccepted, result);
	}
}

func UploadQuestions() gin.HandlerFunc {
	return func(c *gin.Context){
		var q Models.Questions
		if err := c.ShouldBindJSON(&q); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	
		result := Database.DB.Create(&q)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
	
		c.JSON(http.StatusCreated, q)
	}
}