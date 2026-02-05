package controllers

import (
	"context"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/model"
	// "nexcare/backend/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	
)

func PostUser(ctx *gin.Context){
	//insert data into db after successful authentication.
	var user model.User
	err:=ctx.ShouldBindJSON(&user)
	if err!=nil{
		ctx.IndentedJSON(400,gin.H{"Message":err.Error(),"success":false})
		return
	}
	log.Printf("Data from post request %v %v %v\n",user.Name,user.Email,user.Role)

	//Generate OTP
	// act_OTP=util.GenerateOTP()



	//Store in Redis Session with user and generated OTP

	query:="insert into users values($1,$2,$3,$4)"
	_,err=conn.DB.Exec(context.Background(),query,uuid.New().String(),user.Name,user.Role,user.Email)
	if err!=nil{
		ctx.IndentedJSON(400,gin.H{"Message":err.Error(),"success":false})
		return
	}

	ctx.IndentedJSON(200,gin.H{"Message":"Account Created Successfully","success":true})

	//generate the JWT 

	//Move ahead.
}

func GetUser(ctx *gin.Context){
	//returns user from the db.
}