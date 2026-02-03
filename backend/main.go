package main

import (
	"log"
	"nexcare/backend/config"
	"os"
	"nexcare/backend/routes"
	gin "github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("Welcome to NexCare")

	err:=godotenv.Load()
	log.Println(os.Getenv("DB_URL"))
	if err!=nil{
		log.Fatal("Error in loading the env's");
	}
	config.ConnectDB()
	app:=gin.Default()

	routes.RegisterUserRoutes(app)
	
	app.Run(":8090");
}