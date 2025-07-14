package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
)

func FetchTopics () gin.HandlerFunc{
	return func(c *gin.Context){
		var topics []Models.Topics;
		if err := Database.DB.Find(&topics).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch topics"})
			return
		}
		c.JSON(200, topics)

	}
}

func FetchPatternsByTopic() gin.HandlerFunc {
	return func(c *gin.Context) {
		topicID := c.Query("topic_id")

		var patterns []Models.Pattern

		if err := Database.DB.Where("topic_id = ?", topicID).Find(&patterns).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch patterns for the topic"})
			return
		}

		c.JSON(200, patterns)
	}
}

func FetchTopicWiseSheetsByPattern() gin.HandlerFunc {
	return func(c *gin.Context) {
		patternID := c.Query("pattern_id");
		userId, exists := c.Get("user_id")
		if !exists {
			c.JSON(401, gin.H{"error": "User ID not found in context"})
			return
		}
		uid := userId.(float64)

		type TopicWiseQuestionsWithStatus struct {
			ID  	  int    `json:"id"`
			Title     string `json:"title"`
			Status    string `json:"status"`
			Link      string `json:"link"`
		}

		var result []TopicWiseQuestionsWithStatus

		query := `SELECT q.id, q.title, q.link,
		       COALESCE(uqst.status, 'Unsolved') as status
		FROM topic_wise_sheets q
		LEFT JOIN user_question_status_topic_wises uqst
		       ON q.id = uqst.question_id AND uqst.user_id = ?
		WHERE q.pattern_id = ?
		ORDER BY q.id`

		if err := Database.DB.Raw(query, uid, patternID).Scan(&result).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch topic-wise sheets"})
			return
		}
		c.JSON(200, result)

	}
}

func UpdateTopicWiseSheetStatus(id int, userID int, status string) {
	
		var existingStatus Models.UserQuestionStatusTopicWise
		err := Database.DB.First(&existingStatus, "user_id = ? AND question_id = ?", userID, id).Error

		if err != nil {
			if err.Error() == "record not found" {
				newStatus := Models.UserQuestionStatusTopicWise{
					UserId:     userID,
					QuestionId: id,
					Status:     status,
				}
				if err := Database.DB.Create(&newStatus).Error; err != nil {
					fmt.Println("Failed to create new status:", err)
					return
				}
	           }
           }
		var user Models.User
	   if err := Database.DB.First(&user, "user_id = ?", userID).Error; err == nil {
	   	user.TotalSolved++
	   	Database.DB.Save(&user)
	   }   
}


func UpdateTopicWiseSheetProgress(uid int, topicID int) {
		var userStats Models.UserStatsTopicWise
		if err := Database.DB.First(&userStats, "user_id = ?", uid).Error; err != nil {
			if err.Error() == "record not found" {
				newStats := Models.UserStatsTopicWise{
					UserId:          uid,
					OverallSolved:   1,
					TopicWiseData: func() datatypes.JSON {
						data, _ := json.Marshal(map[int]int{topicID: 1})
						return datatypes.JSON(data)
					}(),
				}
				if err := Database.DB.Create(&newStats).Error; err != nil {
					fmt.Println("Failed to create new user stats:", err)
					return
				}
				return
			}
			fmt.Println("Failed to fetch user stats:", err)
		}

		userStats.OverallSolved += 1
		if userStats.TopicWiseData == nil {
			data, _ := json.Marshal(map[int]int{})
			userStats.TopicWiseData = datatypes.JSON(data)
		}
		userStats.TopicWiseData[topicID] += 1

		if err := Database.DB.Save(&userStats).Error; err != nil {
			fmt.Println("Failed to update user stats:", err)
			return
		}
	}


func FetchUserTopicWiseStats() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, exists := c.Get("user_id")
		if !exists {
			c.JSON(401, gin.H{"error": "User ID not found in context"})
			return
		}
		uid := userId.(int)

		var userStats Models.UserStatsTopicWise
		if err := Database.DB.First(&userStats, "user_id = ?", uid).Error; err != nil {
			if err.Error() == "record not found" {
				c.JSON(404, gin.H{"message": "No stats found for this user"})
				return
			}
			c.JSON(500, gin.H{"error": "Failed to fetch user stats"})
			return
		}
		c.JSON(200, userStats)
	}
}

		
		

		