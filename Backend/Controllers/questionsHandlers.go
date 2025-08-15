package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
)

func GetQuestions() gin.HandlerFunc{
	return func(c *gin.Context){
		minRating, _ := strconv.Atoi(c.Query("minRating"))
		maxRating, _ := strconv.Atoi(c.Query("maxRating"))
		page, _ := strconv.Atoi(c.Query("page"))
		limit, _ := strconv.Atoi(c.Query("limit"))
		offset := (page - 1) * limit

		userIDValue, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userID := userIDValue

		type QuestionWithStatus struct {
			QuestionID     int    `json:"question_id"`
			QuestionTitle  string `json:"question_title"`
			Rating         int    `json:"rating"`
			Link           string `json:"link"`
			Status         string `json:"status"`
		}

		var results []QuestionWithStatus

		query := `
		SELECT q.question_id, q.question_title, q.rating, q.link,
		       COALESCE(uqs.status, 'Unsolved') as status
		FROM questions q
		LEFT JOIN user_question_statuses uqs
		       ON q.question_id = uqs.question_id AND uqs.user_id = ?
		WHERE q.rating BETWEEN ? AND ?
		ORDER BY q.question_id
		LIMIT ? OFFSET ?
		`

		if err := Database.DB.Raw(query, userID, minRating, maxRating, limit, offset).Scan(&results).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
			return
		}
		c.JSON(http.StatusOK, results)
	}
}


func UpdateQuestionStatus(userID int,QuestionId int, status string) {
		
	var existingStatus Models.UserQuestionStatus
	err := Database.DB.First(&existingStatus, "user_id = ? AND question_id = ?", userID, QuestionId).Error

	if err == nil {
		existingStatus.Status = status
		Database.DB.Save(&existingStatus)
	} else {
		newStatus := Models.UserQuestionStatus{
			UserId:    userID,
			QuestionId: QuestionId,
			Status:     status,
		}
		Database.DB.Create(&newStatus)
	}
	var user Models.User
	if err := Database.DB.First(&user, "user_id = ?", userID).Error; err == nil {
		user.TotalSolved++
		Database.DB.Save(&user)
	}

}

func UpdateProgressData(userID int, rating int) {
	var userStats Models.UserStats

	err := Database.DB.First(&userStats, "user_id = ?", userID).Error
	if err == nil {
		
		solvedByRating := make(map[string]int)
		if userStats.SolvedByRating != nil {
			json.Unmarshal(userStats.SolvedByRating, &solvedByRating)
		}
		solvedByRating[strconv.Itoa(rating)]++
		updatedSolvedByRating, _ := json.Marshal(solvedByRating)
		userStats.SolvedByRating = datatypes.JSON(updatedSolvedByRating)
		userStats.TotalSolved++
		Database.DB.Save(&userStats)
	} else {

		solvedByRating := map[string]int{strconv.Itoa(rating): 1}
		solvedByRatingJSON, _ := json.Marshal(solvedByRating)
		newUserStats := Models.UserStats{
			UserId:         userID,
			TotalSolved:    1,
			SolvedByRating: datatypes.JSON(solvedByRatingJSON),
		}
		Database.DB.Create(&newUserStats)
	}
}


func GetProgressData() gin.HandlerFunc {
	return func(c *gin.Context) {
		
		userId, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		var progressData Models.UserStats

		
		result := Database.DB.Model(&Models.UserStats{}).
			Where("user_id = ?", userId).
			Select("user_id, total_solved, solved_by_rating").
			First(&progressData) 
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

