package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func IncrementHeatmapData(userID int, date string) error {
	return Database.DB.Transaction(func(tx *gorm.DB) error {
		var stats Models.UserStats

		
		if err := tx.Where("user_id = ?", userID).First(&stats).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				stats = Models.UserStats{
					UserId:         userID,
					TotalSolved:    0,
					SolvedByRating: []byte("{}"),
					ActivityLog:    []byte("{}"),
				}
				if err := tx.Create(&stats).Error; err != nil {
					return fmt.Errorf("failed to create user stats: %w", err)
				}
			} else {
				return fmt.Errorf("failed to query user stats: %w", err)
			}
		}

		logMap := map[string]int{}
		if len(stats.ActivityLog) > 0 {
			if err := json.Unmarshal(stats.ActivityLog, &logMap); err != nil {
				return fmt.Errorf("failed to unmarshal activity log: %w", err)
			}
		}

		logMap[date]++

		newLog, err := json.Marshal(logMap)
		if err != nil {
			return fmt.Errorf("failed to marshal activity log: %w", err)
		}

		return tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Model(&stats).
			Where("user_id = ?", userID).
			Update("activity_log", newLog).Error
	})
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
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusOK, gin.H{"data": map[string]int{}})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user stats"})
			return
		}

		logMap := map[string]int{}
		if len(stats.ActivityLog) > 0 {
			if err := json.Unmarshal(stats.ActivityLog, &logMap); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse activity log"})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"data": logMap})
	}
}
