package Models


type User struct {
	
	OAuthProvider    string    `json:"oauth_provider"`
	OAuthID          string    `json:"oauth_id" gorm:"unique"`
	Email            string    `json:"emial_id"`
	Name             string    `json:"name"`
	ProfilePicture   string    `json:"profile_picture"`
	QuestionSolved   []uint    `json:"question_ids" gorm:"type:json"` 
}