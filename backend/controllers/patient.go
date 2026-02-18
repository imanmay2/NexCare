package controllers

import (
	"github.com/gin-gonic/gin"
)

func GetPatientInfo(ctx *gin.Context){
	ctx.IndentedJSON(200,gin.H{"Message":"Welcome Mr. ","Success":true})
}