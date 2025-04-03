package main

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){

	Database.InitDb()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env ")
	}

	Helpers.Authconfig()

	port := os.Getenv("PORT")

	router:= gin.New()
	router.SetTrustedProxies(nil)

	Routes.AuthRoute(router)

    log.Println("Server is running on :8080")
	router.Run(":"+ port)

}