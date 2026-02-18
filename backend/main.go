package main

import (
	"log"
	"nexcare/backend/config"
	"nexcare/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	// "nexcare/backend/middleware"
)

func main() {
	log.Println("Welcome to NexCare")

	err := godotenv.Load()
	// log.Println(os.Getenv("DB_URL"))
	if err != nil {
		log.Fatal("Error in loading the env's")
	}
	config.ConnectDB()
	config.ConnectRedis()
	app := gin.Default()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://nexcare.netlify.app"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	

	routes.RegisterUserRoutes(app)

	app.Run(":8090")
}
