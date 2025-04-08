package Controllers

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Models"
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"time"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

func GoogleLogin() gin.HandlerFunc{
	return func(c *gin.Context) {
		url := Helpers.GoogleOAuthConfig.AuthCodeURL("randomstate")
		c.Redirect(http.StatusFound, url)
       
	}
}

func GithubLogin() gin.HandlerFunc{	
	return func(c *gin.Context) {
		url := Helpers.GithubOAuthConfig.AuthCodeURL("randomstate")
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
        provider:= ""
		var err error

		if c.Request.Referer() != "" && c.Request.Referer() == "https://github.com/login/oauth/authorize" {
			provider = "github"
			token, err = Helpers.GithubOAuthConfig.Exchange(context.Background(), code)
			if err == nil {
				userInfo, err = fetchGitHubUserInfo(token.AccessToken)
				if err != nil {	
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
					return
				}
			}
		} else {
			provider = "google"
			token, err = Helpers.GoogleOAuthConfig.Exchange(context.Background(), code)
			if err == nil {
				userInfo, err = fetchGoogleUserInfo(token.AccessToken)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
					return
				}
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
	db.Create(&user)
}


	jwtToken, err := generateJWT(user.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate JWT"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   jwtToken,
		"user":    user,
	})
	
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

func fetchGitHubUserInfo(accessToken string) (map[string]interface{}, error) {
	req, _ := http.NewRequest("GET", "https://api.github.com/user", nil)
	req.Header.Set("Authorization", "token "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo map[string]interface{}
	json.Unmarshal(body, &userInfo)
	return userInfo, nil
}

func generateJWT(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
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