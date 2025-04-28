package Models


type Questions struct {
	
	QuestionId            int   `json:"question_id" gorm:"primaryKey;autoIncrement"`
	QuestionTitle         string    `json:"question_title"`
	QuestionDescription   string    `json:"question_desc" gorm:"type:text"`
	Solution              Solution   `json:"solution" gorm:"embedded"`
	Rating                int       `json:"rating"`
 
}

type Solution struct {
    BruteForce string `json:"brute_force" gorm:"type:text"`
    Optimal    string `json:"optimal" gorm:"type:text"`
    CodeCpp    string `json:"code_cpp" gorm:"type:text"`
	CodeJava   string `json:"code_java" gorm:"type:text"`
	CodePy     string `json:"code_py" gorm:"type:text"`
}