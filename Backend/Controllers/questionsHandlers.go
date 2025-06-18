package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"fmt"
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
		userID := userIDValue.(float64)

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
		ORDER BY q.rating
		LIMIT ? OFFSET ?
		`

		if err := Database.DB.Raw(query, userID, minRating, maxRating, limit, offset).Scan(&results).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
			return
		}

		c.JSON(http.StatusOK, results)
	}
}

type StatusUpdateInput struct {
	QuestionId int    `json:"question_id"` 
	Status     string `json:"status"`      
}

func UpdateQuestionStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		var input StatusUpdateInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		userIDRaw, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}
		userID := userIDRaw.(float64)
	var existingStatus Models.UserQuestionStatus
	err := Database.DB.First(&existingStatus, "user_id = ? AND question_id = ?", userID, input.QuestionId).Error
	if err != nil && err.Error() != "record not found" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch existing status"})
		return
	}

	if existingStatus.Status == "Solved" && input.Status != "Solved" {
		var userprogress Models.UserStats
		var solvedByRatingMap map[string]int
		var question Models.Questions

		err2 := Database.DB.First(&userprogress, "user_id = ?", userID).Error
		err3 := Database.DB.First(&question, "question_id = ?", input.QuestionId).Error
		if err2 != nil || err3 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user progress or question"})
			return
		}

		if err := json.Unmarshal(userprogress.SolvedByRating, &solvedByRatingMap); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse SolvedByRating"})
			return
		}

		ratingKey := fmt.Sprintf("%d", question.Rating)
		if solvedByRatingMap[ratingKey] > 0 {
			solvedByRatingMap[ratingKey] -= 1
		}

		updatedJSON, err := json.Marshal(solvedByRatingMap)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update SolvedByRating"})
			return
		}

		userprogress.SolvedByRating = datatypes.JSON(updatedJSON)
		if err := Database.DB.Save(&userprogress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save progress"})
			return
		}
	} else if input.Status == "Solved" {
		var userprogress Models.UserStats
		var solvedByRatingMap map[string]int
		var question Models.Questions

		err2 := Database.DB.First(&userprogress, "user_id = ?", userID).Error
		err3 := Database.DB.First(&question, "question_id = ?", input.QuestionId).Error
		if err2 != nil || err3 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user progress or question"})
			return
		}

		if err := json.Unmarshal(userprogress.SolvedByRating, &solvedByRatingMap); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse SolvedByRating"})
			return
		}

		ratingKey := fmt.Sprintf("%d", question.Rating)
		solvedByRatingMap[ratingKey] += 1

		updatedJSON, err := json.Marshal(solvedByRatingMap)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update SolvedByRating"})
			return
		}

		userprogress.SolvedByRating = datatypes.JSON(updatedJSON)
		if err := Database.DB.Save(&userprogress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save progress"})
			return
		}
	}

	var existing Models.UserQuestionStatus
		err4:= Database.DB.First(&existing, "user_id = ? AND question_id = ?", userID, input.QuestionId).Error

		if err4 == nil {
			
			existing.Status = input.Status
			Database.DB.Save(&existing)

		} else {
			newStatus := Models.UserQuestionStatus{
				UserId:    int(userID),
				QuestionId: input.QuestionId,
				Status:     input.Status,
			}
			Database.DB.Create(&newStatus)
		}

		c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
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

