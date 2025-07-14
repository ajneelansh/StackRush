package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func IncrementHeatmapData(userID int, date string)  {

	var stats Models.UserStats
	err := Database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ?", userID).
			First(&stats).Error; err != nil {
			return err
		}

	logMap := map[string]int{}
	_ = json.Unmarshal(stats.ActivityLog, &logMap)
	logMap[date]++

	newLog, _ := json.Marshal(logMap)
	return tx.Model(&stats).Update("activity_log", newLog).Error
})

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error incrementing heatmap data: %v\n", err)
	}

}



func GetHeatmap() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		var stats Models.UserStats
		if err := Database.DB.First(&stats, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		logMap := map[string]int{}
		if len(stats.ActivityLog) > 0 {
			_ = json.Unmarshal(stats.ActivityLog, &logMap)
		}

		c.JSON(http.StatusOK, gin.H{"data": logMap})
	}
}

func GetHeatmapByUsername() gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Query("username")
		if username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
			return
		}

		var user Models.User
		if err := Database.DB.Where("username = ?", username).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		var stats Models.UserStats
		if err := Database.DB.First(&stats, user.UserId).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User stats not found"})
			return
		}

		logMap := map[string]int{}
		if len(stats.ActivityLog) > 0 {
			_ = json.Unmarshal(stats.ActivityLog, &logMap)
		}

		c.JSON(http.StatusOK, gin.H{"data": logMap})
	}
}
