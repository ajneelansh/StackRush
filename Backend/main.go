package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/ajneelansh/StackRush/Backend/Routes"
	"github.com/gin-gonic/gin"
)

func main(){
	port:= os.Getenv(port)

	router:= gin.New()
	Routes.AuthRoutes(router)

	router.Run(":"+ port)

}