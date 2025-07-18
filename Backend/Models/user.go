package Models

import (
    "gorm.io/datatypes"
)


type User struct {
	UserId           int       `json:"user_id" gorm:"primaryKey;autoIncrement"`
	OAuthProvider    string    `json:"oauth_provider"`
	OAuthID          string    `json:"oauth_id" gorm:"unique"`
	Email            string    `json:"email_id"`
	Name             string    `json:"name"`
	ProfilePicture   string    `json:"profile_picture"`
	College 		 string    `json:"college"`
	Batch			 string    `json:"batch"`
	Location         string    `json:"location"`
	Username		 string    `json:"username" gorm:"unique;primaryKey"`
	LeetcodeUsername string    `json:"leetcode" gorm:"unique"`
	CodeforcesHandle string    `json:"codeforces" gorm:"unique"`
	Bio			     string    `json:"bio"`
	TotalSolved	  int       `json:"total_solved" gorm:"default:0"`
}

type UserStats struct {
	UserId            int    `gorm:"primaryKey"` 
	TotalSolved       int    `json:"total_solved" gorm:"default:0"`
	SolvedByRating   datatypes.JSON   `gorm:"type:json"`
	ActivityLog       datatypes.JSON   `gorm:"type:json"`
}

type UserQuestionStatus struct {
	UserId          int   `gorm:"primaryKey"`
	QuestionId      int   `gorm:"primaryKey"`
	Status     string    `gorm:"type:varchar(20)"`

	User     User     `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
    Question Questions`gorm:"foreignKey:QuestionId;constraint:OnDelete:CASCADE"`
}

type UserQuestionStatusTopicWise struct {
	UserId          int   `gorm:"primaryKey"`
	QuestionId      int   `gorm:"primaryKey"`
	Status     string    `gorm:"type:varchar(20)"`

	User	 User     `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
	TopicWiseSheet TopicWiseSheet `gorm:"foreignKey:QuestionId;constraint:OnDelete:CASCADE"`
}

type UserStatsTopicWise struct {
	UserId            int    `gorm:"primaryKey"`  
	OverallSolved       int    `json:"overall_solved" gorm:"default:0"`
	TopicWiseData   datatypes.JSON   `gorm:"type:json"`
}



