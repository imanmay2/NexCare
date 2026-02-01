package main

import (
	"log"
	gin "github.com/gin-gonic/gin"
)

func main() {
	log.Println("Welcome to NexCare")

	app:=gin.Default()

	app.GET("/",func(ctx *gin.Context){
		ctx.IndentedJSON(200,gin.H{"Message":"Welcome to NexCare","success":"true"})
	})


	app.Run(":8090");
}