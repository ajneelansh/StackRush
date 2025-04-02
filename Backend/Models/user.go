package Models

import "gorm.io/gorm"

type User struct {
	
	gorm.Model
	OAuthProvider string `json:"oauth_provider"`
	OAuthID string `json:"oauth_id" gorm:"unique"`
	Email string `json:"emial_id"`
	Name string `json:"name"`
	ProfilePicture string `json:"pc"`

}