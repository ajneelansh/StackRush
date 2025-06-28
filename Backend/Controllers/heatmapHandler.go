package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func DecrementHeatmapData() gin.HandlerFunc{
	return func(c *gin.Context){
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

    today := time.Now().Format("2006-01-02")
    if logMap[today] > 0 {
        logMap[today]--
    }

    newLog, _ := json.Marshal(logMap)

    Database.DB.Model(&stats).Updates(map[string]interface{}{
        "activity_log":  newLog,
    })

	}
}

func IncrementHeatmapData() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		var stats Models.UserStats
    uid, ok := userID.(int)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
        return
    }
    if err := Database.DB.FirstOrCreate(&stats, Models.UserStats{UserId: uid}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

	

   
    logMap := map[string]int{}
    if len(stats.ActivityLog) > 0 {
        _ = json.Unmarshal(stats.ActivityLog, &logMap)
    }

    today := time.Now().Format("2006-01-02")
	if _, exist := logMap[today]; !exist {
        logMap[today] = 0
    }
    logMap[today]++

    newLog, _ := json.Marshal(logMap)

    
    Database.DB.Model(&stats).Updates(map[string]interface{}{
        "activity_log":  newLog,
    })
  }
}


type HeatmapEntry struct {
    Date  string `json:"date"`
    Count int    `json:"count"`
}

func GetHeatmap() gin.HandlerFunc{
	return func(c *gin.Context){
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

    today := time.Now().Truncate(24 * time.Hour)
    result := make(map[string]int)

    for i := 0; i < 365; i++ {
        date := today.AddDate(0, 0, -i).Format("2006-01-02")
        result[date] = logMap[date] 
    }

    c.JSON(http.StatusOK, result)

    }
}