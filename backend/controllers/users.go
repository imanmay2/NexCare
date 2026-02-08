package controllers

import (
	"context"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/model"
	"nexcare/backend/util"
)

func PostUser(ctx *gin.Context) {
	//insert data into db after verifying OTP.
	var user model.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.IndentedJSON(400, gin.H{"Message": err.Error(), "success": false})
		return
	}
	log.Printf("Data from post request %v %v %v %v\n", user.Name, user.Email, user.Role, user.Otp)

	if util.VerifyOTP(user.Email, user.Otp) {

		query := "insert into users values($1,$2,$3,$4)"
		_, err = conn.DB.Exec(context.Background(), query, uuid.New().String(), user.Name, user.Role, user.Email)
		if err != nil {
			ctx.IndentedJSON(400, gin.H{"Message": err.Error(), "success": false})
			return
		}
		ctx.IndentedJSON(200, gin.H{"Message": "Account Created Successfully", "success": true})
		//generate the JWT.

		//Move ahead.
	} else {
		ctx.IndentedJSON(401,gin.H{"Message":"Incorrect OTP entered.","success":false})
		return
	}
}

func GetUser(ctx *gin.Context) {
	//returns userdata from the db.

}

func Generate_StoreOTP(ctx *gin.Context) {
	var user model.UserOtp
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}

	email_id := user.Email

	//generate OTP
	actualOTP := util.GenerateOTP()

	//Store OTP in Redis
	util.StoreRedisOTP(email_id, actualOTP)
}