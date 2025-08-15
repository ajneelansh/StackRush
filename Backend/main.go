package main

import (
	"Backend/Database"
	"Backend/Helpers"
	"Backend/Routes"
	"log"
	
	"os"
    "github.com/gin-contrib/cors"
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

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://codehurdle.com", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}));
    Routes.PublicUserRoute(router)
	Routes.AuthRoute(router)
	Routes.AdminRoutes(router)
	Routes.UserRoute(router)

    log.Println("Server is running on :8080")
	router.Run(":"+ port)

}