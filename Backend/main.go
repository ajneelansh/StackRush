package main

import (
	"Backend/Routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env ")
	}

	port := os.Getenv("PORT")

	router:= gin.New()

	Routes.AuthRoute(router)

	router.Run(port)

}