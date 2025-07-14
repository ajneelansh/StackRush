package Database

import (
	"fmt"
	"os"
	"log"
   "Backend/Models"      

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var     DB *gorm.DB;

func InitDb(){
   err:= godotenv.Load()
   
   if err!=nil {
	log.Fatal("Error Loading .env file")
   }

   dsn := os.Getenv("DATABASE_URL")
   if dsn == "" {
       log.Fatal("DATABASE_URL is not set in the environment variables")
   }
   db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

   DB = db

   if err!=nil{
       log.Fatal("Error in connecting database", err)
   }
   if err := DB.AutoMigrate(&Models.User{}); err != nil {
       log.Fatal("Error migrating User model:", err)
   }
   if err := DB.AutoMigrate(&Models.Questions{}); err != nil {
       log.Fatal("Error migrating Questions model:", err)
   }
   if err := DB.AutoMigrate(&Models.UserStats{}); err != nil {
    log.Fatal("Error migrating UserStats model:", err)
   }
   if err := DB.AutoMigrate(&Models.UserQuestionStatus{}); err != nil {
    log.Fatal("Error migrating UserQuestionStatus model:", err)
   }
    if err := DB.AutoMigrate(&Models.Topics{}); err != nil {
    log.Fatal("Error migrating topic model:", err)
   }
   if err := DB.AutoMigrate(&Models.Pattern{}); err != nil {
    log.Fatal("Error migrating pattern model:", err)
   }
   if err := DB.AutoMigrate(&Models.TopicWiseSheet{}); err != nil {
    log.Fatal("Error migrating topicwisesheet model:", err)
   }
    var topicCount, patternCount int64
    DB.Model(&Models.Topics{}).Count(&topicCount)
	DB.Model(&Models.Pattern{}).Count(&patternCount)
    if topicCount == 0 {
		db.Exec(`ALTER SEQUENCE topics_id_seq RESTART WITH 1001`)
	}
    if patternCount == 0 {
		db.Exec(`ALTER SEQUENCE patterns_id_seq RESTART WITH 101`)
	}
     if err := DB.AutoMigrate(&Models.UserQuestionStatusTopicWise{}); err != nil {
    log.Fatal("Error migrating UserQuestionStatusTopicWise model:", err)
   }
    if err := DB.AutoMigrate(&Models.UserStatsTopicWise{}); err != nil {
    log.Fatal("Error migrating TopicWiseStats model:", err)
    }
   
   fmt.Println("DB connected")
}
