package Models


type Questions struct {
	QuestionId            string    `json:question_id gorm:unique`
	QuestionTitle         string    `json:question_title`
	QuestionDescription   string    `json:question_desc`
	Solution              string    `json:solution`
	Rating                int       `json:rating`
 
}