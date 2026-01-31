package main

import (
	"log"
	gin "github.com/gin-gonic/gin"
	"os"
	"nexcare/backend/config"
	env "github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"time"
	router "nexcare/backend/router"
)

func main() {
	env.Load()
	log.Println("Welcome to NexCare")

	log.Printf("----> PostgreSQL : %v\n",os.Getenv("DB_URL"));
	config.ConnectDB()
	

	app:=gin.Default()

	app.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://localhost:5173"},
    AllowMethods:     []string{"PUT", "PATCH","GET","POST","DELETE"},
    AllowHeaders:     []string{"Origin"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge: 12 * time.Hour,
  }))

  router.RegisterUserRoute(app)


	app.Run(":8090");
}