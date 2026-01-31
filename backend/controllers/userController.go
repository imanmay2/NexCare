package controllers

import (
	"github.com/gin-gonic/gin"
)

func GetUser(ctx *gin.Context){
	ctx.IndentedJSON(200,gin.H{"id":"P123","name":"Manmay","role":"patient","phn_no":8597927166})
	
}