package Controllers

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Models"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func GoogleLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err == nil {
			if _, err := Helpers.ValidateAccessToken(accessToken); err == nil {
				c.Redirect(http.StatusFound, "http://localhost:3000/dashboard")
				return
			}
		}

		refreshToken, err := c.Cookie("refresh_token")
		if err == nil {
			if claims, err := Helpers.ValidateRefreshToken(refreshToken); err == nil {
				var user Models.User
				db := Database.DB
				if err := db.Where("user_id = ?", claims.UserID).First(&user).Error; err == nil {
					if user.RefreshToken != nil && *user.RefreshToken == refreshToken && user.RefreshTokenExpiresAt.After(time.Now()) {
						newAccessToken, newRefreshToken, newAccessExp, newRefreshExp, jwtErr := Helpers.GenerateAccessAndRefreshTokens(user.UserId)
						if jwtErr == nil {
							user.RefreshToken = &newRefreshToken
							user.RefreshTokenExpiresAt = &newRefreshExp
							db.Save(&user)
							setAuthCookies(c, newAccessToken, newAccessExp, newRefreshToken, newRefreshExp)
							c.Redirect(http.StatusFound, "http://localhost:3000/dashboard")
							return
						}
					}
				}
			}
		}

		state := Helpers.GenerateRandomString(32)
		url := Helpers.GoogleOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
		c.Redirect(http.StatusFound, url)
	}
}

func OAuthCallback() gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")

		if code == "" {
			log.Println("OAuthCallback: Code not found in query parameters.")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization code not found."})
			return
		}

		db := Database.DB

		token, err := Helpers.GoogleOAuthConfig.Exchange(c.Request.Context(), code)
		if err != nil {
			log.Printf("OAuthCallback: Token exchange failed: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange authorization code for token."})
			return
		}

		userInfo, err := fetchGoogleUserInfo(token.AccessToken)
		if err != nil {
			log.Printf("OAuthCallback: Failed to fetch user info: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user information from Google."})
			return
		}

		provider := "google"
		oauthID := Helpers.GetStringValue(userInfo["id"])
		email := Helpers.GetStringValue(userInfo["email"])
		name := Helpers.GetStringValue(userInfo["name"])
		profilePicture := Helpers.GetStringValue(userInfo["picture"])

		var user Models.User

		result := db.WithContext(c.Request.Context()).Where("o_auth_provider = ? AND o_auth_id = ?", provider, oauthID).First(&user)

		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			user = Models.User{
				OAuthProvider:  provider,
				OAuthID:        oauthID,
				Email:          email,
				Name:           name,
				ProfilePicture: profilePicture,
			}

			baseUsername := ""
			if email != "" {
				if atIndex := strings.Index(email, "@"); atIndex != -1 {
					baseUsername = strings.ToLower(email[:atIndex])
				}
			}
			if baseUsername == "" && name != "" {
				baseUsername = strings.ToLower(strings.ReplaceAll(name, " ", ""))
			}
			if baseUsername == "" {
				baseUsername = "user" + Helpers.GenerateRandomString(4)
			}

			finalUsername := baseUsername
			counter := 0
			for {
				var existingUser Models.User
				checkResult := db.WithContext(c.Request.Context()).Where("username = ?", finalUsername).First(&existingUser)
				if errors.Is(checkResult.Error, gorm.ErrRecordNotFound) {
					break
				} else if checkResult.Error != nil {
					log.Printf("OAuthCallback: Database error during username uniqueness check: %v", checkResult.Error)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate unique username."})
					return
				}
				counter++
				finalUsername = baseUsername + strconv.Itoa(counter)
			}
			user.Username = finalUsername

			accessToken, refreshToken, accessExp, refreshExp, jwtErr := Helpers.GenerateAccessAndRefreshTokens(user.UserId)
			if jwtErr != nil {
				log.Printf("OAuthCallback: Failed to generate JWT tokens for new user: %v", jwtErr)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate authentication tokens."})
				return
			}

			user.RefreshToken = &refreshToken
			user.RefreshTokenExpiresAt = &refreshExp

			if err := db.WithContext(c.Request.Context()).Create(&user).Error; err != nil {
				log.Printf("OAuthCallback: User creation failed: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user account."})
				return
			}
			log.Printf("OAuthCallback: Created new user ID: %d with username: %s", user.UserId, user.Username)

			userStats := Models.UserStats{
				UserId:         user.UserId,
				TotalSolved:    0,
				SolvedByRating: datatypes.JSON([]byte(`{"1350":0,"1500":0,"1650":0,"1800":0,"1950":0}`)),
			}
			if err := db.WithContext(c.Request.Context()).Create(&userStats).Error; err != nil {
				log.Printf("OAuthCallback: UserStats creation failed for user %d: %v", user.UserId, err)

			}
			setAuthCookies(c, accessToken, accessExp, refreshToken, refreshExp)

		} else if result.Error != nil {
			log.Printf("OAuthCallback: Database query failed: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error during user lookup."})
			return
		} else {
			user.Email = email
			user.Name = name
			user.ProfilePicture = profilePicture
			accessToken, refreshToken, accessExp, refreshExp, jwtErr := Helpers.GenerateAccessAndRefreshTokens(user.UserId)
			if jwtErr != nil {
				log.Printf("OAuthCallback: Failed to generate JWT tokens for existing user: %v", jwtErr)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate authentication tokens."})
				return
			}

			user.RefreshToken = &refreshToken
			user.RefreshTokenExpiresAt = &refreshExp

			if err := db.WithContext(c.Request.Context()).Save(&user).Error; err != nil {
				log.Printf("OAuthCallback: Failed to update user %d: %v", user.UserId, err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user information."})
				return
			}
			log.Printf("OAuthCallback: Updated existing user ID: %d", user.UserId)

			setAuthCookies(c, accessToken, accessExp, refreshToken, refreshExp)
		}

		c.Redirect(http.StatusFound, "http://localhost:3000/dashboard")
	}
}

func RefreshAccessToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		refreshTokenString, err := c.Cookie("refresh_token")
		if err != nil {
			log.Println("RefreshAccessToken: Refresh token cookie not found.")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token required."})
			return
		}

		claims, err := Helpers.ValidateRefreshToken(refreshTokenString)
		if err != nil {
			log.Printf("RefreshAccessToken: Invalid refresh token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token. Please log in again."})
			c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
			return
		}

		db := Database.DB
		var user Models.User

		result := db.WithContext(c.Request.Context()).Where("user_id = ?", claims.UserID).First(&user)
		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				log.Printf("RefreshAccessToken: User %d not found for refresh token.", claims.UserID)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found."})
				return
			}
			log.Printf("RefreshAccessToken: Database error during user lookup: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
			return
		}

		if user.RefreshToken == nil || *user.RefreshToken != refreshTokenString {
			log.Printf("RefreshAccessToken: Provided refresh token does not match stored token for user %d.", user.UserId)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token. Please log in again."})

			user.RefreshToken = nil
			user.RefreshTokenExpiresAt = nil
			db.WithContext(c.Request.Context()).Save(&user)
			c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
			return
		}

		if user.RefreshTokenExpiresAt == nil || user.RefreshTokenExpiresAt.Before(time.Now()) {
			log.Printf("RefreshAccessToken: Refresh token for user %d has expired.", user.UserId)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token has expired. Please log in again."})
			user.RefreshToken = nil
			user.RefreshTokenExpiresAt = nil
			db.WithContext(c.Request.Context()).Save(&user)
			c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
			return
		}

		newAccessToken, newRefreshToken, newAccessExp, newRefreshExp, jwtErr := Helpers.GenerateAccessAndRefreshTokens(user.UserId)
		if jwtErr != nil {
			log.Printf("RefreshAccessToken: Failed to generate new tokens for user %d: %v", user.UserId, jwtErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate new authentication tokens."})
			return
		}

		user.RefreshToken = &newRefreshToken
		user.RefreshTokenExpiresAt = &newRefreshExp
		if err := db.WithContext(c.Request.Context()).Save(&user).Error; err != nil {
			log.Printf("RefreshAccessToken: Failed to update refresh token for user %d: %v", user.UserId, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update authentication tokens."})
			return
		}

		setAuthCookies(c, newAccessToken, newAccessExp, newRefreshToken, newRefreshExp)

		c.JSON(http.StatusOK, gin.H{"message": "Access token refreshed successfully."})
	}
}

func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := Database.DB
		userID, exists := c.Get("user_id") 
		if exists {
			var id int
			switch v := userID.(type) {
			case float64:
				id = int(v)
			case int:
				id = v
			default:
				log.Printf("Logout: Unexpected type for user_id in context: %T", v)
				id = 0
			}

			if id != 0 {
				var user Models.User
				result := db.WithContext(c.Request.Context()).Where("user_id = ?", id).First(&user)
				if result.Error == nil { 
					user.RefreshToken = nil
					user.RefreshTokenExpiresAt = nil
					if err := db.WithContext(c.Request.Context()).Save(&user).Error; err != nil {
						log.Printf("Logout: Failed to clear refresh token for user %d: %v", id, err)
					} else {
						log.Printf("Logout: Refresh token cleared from DB for user %d.", id)
					}
				} else if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
					log.Printf("Logout: Database error finding user %d for logout: %v", id, result.Error)
				}
			}
		} else {
			log.Println("Logout: UserID not found in context. Proceeding to clear cookies.")
		}

		isProduction := gin.Mode() == gin.ReleaseMode

		c.SetCookie(
			"access_token",
			"",
			-1,           // MaxAge: -1 immediately deletes the cookie
			"/",          // Path: Must match the path used when setting the cookie
			"localhost",  // Domain: Must match the domain used when setting the cookie
			isProduction, // Secure: Should be true in production
			true,         // HttpOnly: Must match the HttpOnly setting
		)

		c.SetCookie(
			"refresh_token",
			"",
			-1,
			"/",
			"localhost",
			isProduction, 
			true,
		)

		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully."})
	}
}

func setAuthCookies(c *gin.Context, accessToken string, accessExp time.Time, refreshToken string, refreshExp time.Time) {
	accessMaxAge := int(time.Until(accessExp).Seconds())
	c.SetCookie(
		"access_token",
		accessToken,
		accessMaxAge,
		"/",
		"localhost",
		true,
		true,
	)
	log.Printf("Set access_token cookie, expires in %d seconds", accessMaxAge)

	refreshMaxAge := int(time.Until(refreshExp).Seconds())
	c.SetCookie(
		"refresh_token",
		refreshToken,
		refreshMaxAge,
		"/",
		"localhost",
		true,
		true,
	)
	log.Printf("Set refresh_token cookie, expires in %d seconds", refreshMaxAge)
}
