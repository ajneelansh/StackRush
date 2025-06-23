package Controllers

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Models"
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func GoogleLogin() gin.HandlerFunc{
	return func(c *gin.Context) {
		url := Helpers.GoogleOAuthConfig.AuthCodeURL("randomstate")
		c.Redirect(http.StatusFound, url)
       
	}
}

func OAuthCallback() gin.HandlerFunc{
	return func(c *gin.Context){
		code := c.Query("code")
		if code == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found"})
			return
		}
		
		var userInfo map[string]interface{}
		var token *oauth2.Token
		var err error

		
			provider := "google"
			token, err = Helpers.GoogleOAuthConfig.Exchange(context.Background(), code)
			if err == nil {
				userInfo, err = fetchGoogleUserInfo(token.AccessToken)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
					return
				}
			}
	


	var user Models.User
	db := Database.DB

	result := db.Where("o_auth_provider = ? AND o_auth_id = ?", provider, getStringValue(userInfo["id"])).First(&user)

if errors.Is(result.Error, gorm.ErrRecordNotFound) {
	user = Models.User{
		OAuthProvider:  provider,
		OAuthID:        getStringValue(userInfo["id"]),
		Email:          getStringValue(userInfo["email"]),
		Name:           getStringValue(userInfo["name"]),
		ProfilePicture: getStringValue(userInfo["picture"]),
	}

	if err := db.Create(&user).Error; err != nil {
		log.Println("User insert failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	log.Println("Created user ID:", user.UserId)

	userStats := Models.UserStats{
		UserId:         user.UserId,
		TotalSolved:    0,
		SolvedByRating: datatypes.JSON([]byte(`{"1350":0,"1500":0,"1650":0,"1800":0,"1950":0}`)), 
	}

	if err := db.Create(&userStats).Error; err != nil {
		log.Println("UserStats insert failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserStats creation failed"})
		return
	}
}

	jwtToken, err := generateJWT(user.UserId)
	if err != nil {
		log.Println("JWT generation failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
		return
	}
    c.SetCookie("token", jwtToken, 3600*24, "/", "localhost", false, true)
	c.Redirect(http.StatusFound, "https://codehurdle.com/dashboard")
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


func generateJWT(userId int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userId,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func getStringValue(value interface{}) string {
    if str, ok := value.(string); ok {
        return str
    }
    return ""
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
		})
	}
}