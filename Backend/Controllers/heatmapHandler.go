package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func IncrementHeatmapData() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		var uid int
		switch v := userID.(type) {
		case float64:
			uid = int(v)
		case int:
			uid = v
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected user ID type"})
			return
		}

		var body struct {
			Date string `json:"date"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Date == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
			return
		}

	var stats Models.UserStats
	err := Database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ?", uid).
			First(&stats).Error; err != nil {
			return err
		}

	logMap := map[string]int{}
	_ = json.Unmarshal(stats.ActivityLog, &logMap)
	logMap[body.Date]++

	newLog, _ := json.Marshal(logMap)
	return tx.Model(&stats).Update("activity_log", newLog).Error
})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

		c.Status(http.StatusOK)
	}
}



func DecrementHeatmapData() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}
        var uid int
		switch v := userID.(type) {
		case float64:
			uid = int(v)
		case int:
			uid = v
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected user ID type"})
			return
		}

		var body struct {
			Date string `json:"date"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Date == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
			return
		}

		var stats Models.UserStats
		if err := Database.DB.First(&stats, uid).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		logMap := map[string]int{}
		if len(stats.ActivityLog) > 0 {
			_ = json.Unmarshal(stats.ActivityLog, &logMap)
		}

		if logMap[body.Date] > 0 {
			logMap[body.Date]--
		}
		newLog, _ := json.Marshal(logMap)

		Database.DB.Model(&stats).Update("activity_log", newLog)
		c.Status(http.StatusOK)
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
