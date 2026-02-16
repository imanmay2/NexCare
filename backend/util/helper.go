package util

import "github.com/gin-gonic/gin"

func FindUserid(ctx *gin.Context){
	

	q1:=` select id from users where email= $1 `

	
}