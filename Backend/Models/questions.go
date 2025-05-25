package Models


type Questions struct {
	QuestionId            int   `json:"question_id" gorm:"primaryKey;autoIncrement"`
	QuestionTitle         string    `json:"question_title"`
	Rating                int       `json:"rating"`
	Link                  string    `json:"link"`
}

	
