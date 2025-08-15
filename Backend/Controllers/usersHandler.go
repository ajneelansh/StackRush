package Controllers

import (
	"Backend/Database"
	"Backend/Models"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func UpdateProfile() gin.HandlerFunc {
	return func(c *gin.Context) {
		uid, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}


		var body struct {
			Name              string `json:"name"`
			College           string `json:"college"`
			Batch             string `json:"batch"`
			Location          string `json:"location"`
			Username          string `json:"username"`
			LeetcodeUsername  string `json:"leetcode"`
			CodeforcesHandle  string `json:"codeforces"`
			Bio               string `json:"bio"`
			ProfilePicture    string `json:"profile_picture"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var user Models.User
		if err := Database.DB.First(&user, uid).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			}
			return
		}

		
		var existingUser Models.User
		if err := Database.DB.Where("username = ? AND user_id != ?", body.Username, uid).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
			return
		}

		user.Name = body.Name
		user.College = body.College
		user.Batch = body.Batch
		user.Location = body.Location
		user.Bio = body.Bio
		user.Username = body.Username
		user.LeetcodeUsername = body.LeetcodeUsername
		user.CodeforcesHandle = body.CodeforcesHandle
		user.ProfilePicture = body.ProfilePicture

		if err := Database.DB.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
	}
}

func fetchGoogleUserInfo(accessToken string) (map[string]interface{}, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var user map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&user)
	return user, err
}


func GetUserInfo() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		var user Models.User
		if err := Database.DB.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"name":           user.Name,
			"email":          user.Email,
			"profile_picture": user.ProfilePicture,
			"college":        user.College,
			"batch":          user.Batch,
			"location":       user.Location,
			"username":       user.Username,
			"leetcode":       user.LeetcodeUsername,
			"codeforces":     user.CodeforcesHandle,
			"bio":            user.Bio,
			"coins":         user.Coins,
		})
	}
}

func GetUserByUsername() gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Query("username")
		username = strings.TrimSpace(username)
		if username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
			return
		}

		var user Models.User
		if err := Database.DB.Where("username = ?", username).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"name":           user.Name,
			"email":          user.Email,
			"profile_picture": user.ProfilePicture,
			"college":        user.College,
			"batch":          user.Batch,
			"location":       user.Location,
			"username":       user.Username,
			"leetcode":       user.LeetcodeUsername,
			"codeforces":     user.CodeforcesHandle,
			"bio":            user.Bio,
			"total_solved":   user.TotalSolved,
		})

	}
}