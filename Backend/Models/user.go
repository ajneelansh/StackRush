package Models

import "gorm.io/datatypes"


type User struct {
	UserId           int       `json:"user_id" gorm:"primaryKey;autoIncrement"`
	OAuthProvider    string    `json:"oauth_provider"`
	OAuthID          string    `json:"oauth_id" gorm:"unique"`
	Email            string    `json:"email_id"`
	Name             string    `json:"name"`
	ProfilePicture   string    `json:"profile_picture"`
}

type UserStats struct {
	UserId            int    `gorm:"primaryKey"`  
	TotalSolved       int    `json:"total_solved" gorm:"default:0"`
	SolvedByRating   datatypes.JSON   `gorm:"type:json"`
}

type UserQuestionStatus struct {
	UserId          int   `gorm:"primaryKey"`
	QuestionId      int   `gorm:"primaryKey"`
	Status     string    `gorm:"type:varchar(20)"`

	User     User     `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
    Question Questions`gorm:"foreignKey:QuestionId;constraint:OnDelete:CASCADE"`
}

