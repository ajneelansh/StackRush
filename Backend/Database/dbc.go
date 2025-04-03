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

var DB *gorm.DB;

func InitDb(){
   err:= godotenv.Load()
   
   if err!=nil {
	log.Fatal("Error Loading .env file")
   }

   dsn := os.Getenv("DATABASE_URL")
   db ,err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

   if err!=nil{
       log.Fatal("Error in connecting database", err)
   }
   db.AutoMigrate(&Models.User{})

   DB = db 
   fmt.Println("DB connected")
}
