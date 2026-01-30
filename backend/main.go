package main

import (
	"log"
	gin "github.com/gin-gonic/gin"
	"os"
	"nexcare/backend/config"
	env "github.com/joho/godotenv"

)

func main() {
	env.Load()
	log.Println("Welcome to NexCare")

	log.Printf("----> PostgreSQL : %v\n",os.Getenv("DB_URL"));
	config.ConnectDB()
	

	app:=gin.Default()

	app.GET("/",func(ctx *gin.Context){
		ctx.IndentedJSON(200,gin.H{"Message":"Welcome to NexCare","success":"true"})
	})



	app.Run(":8090");
}