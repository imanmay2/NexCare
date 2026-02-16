package controllers

import (
	"context"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/model"
	"nexcare/backend/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	if (util.VerifyOTP(user.Email, user.Otp)  && !user.IsLogin){
		//signup


		//generate the JWT and send it to the frontend.
		user_id:=uuid.New().String()

		token,err:=util.GenerateJWT(user_id,user.Email) //generated the jwt token after successful OTP verification
		if err!=nil{
			ctx.IndentedJSON(500,gin.H{"Message":"Couldn't generate JWT Token","success":false})
			return
		}

		query := "insert into users values($1,$2,$3,$4)"
		_, err = conn.DB.Exec(context.Background(), query, user_id, user.Name, user.Role, user.Email)
		if err != nil {
			ctx.IndentedJSON(400, gin.H{"Message": err.Error(), "success": false})
			return
		}
		ctx.IndentedJSON(200, gin.H{"Message": "Account Created Successfully", "success": true,"token":token}) //sends the jwt token to frontend
		

		
	}else if(util.VerifyOTP(user.Email, user.Otp)  && user.IsLogin){
		// generate JWT token if otp verifies. 


		//function to fetch the user_id for passing into generate_JWT token. 
		

		ctx.IndentedJSON(200,gin.H{"name":"Manmay","role":"patient"})
		return 
	} else {
		ctx.IndentedJSON(401, gin.H{"Message": "Incorrect OTP entered.", "success": false})
		return
	}
}



func Generate_StoreOTP(ctx *gin.Context) {
	var user model.UserOtp
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}

	email_id := user.Email
	isLogin := user.IsLogin

	//TODO: Check if the email exists in the users database for proceesing to login else show "${email} isn't registered".
	q := " select id,name,role,email from users where email=$1 "
	rows, err := conn.DB.Query(context.Background(), q, email_id)
	if err != nil {
		ctx.IndentedJSON(401, gin.H{"Message": err.Error(), "success": false})
		return
	}

	found := false
	for rows.Next() {
		found = true
		log.Printf("---->found : %v\n",found)
	}

	if found {
		if isLogin {
			log.Printf("--> User logging in...")
			util.Create_Send_OTP(email_id, ctx)
			return
		} else {
			//user can't signup as already data exists
			ctx.IndentedJSON(401, gin.H{"Message": "Account already exists", "success": false})
			return

		}
	} else {
		if isLogin {
			//user not found , so no login
			ctx.IndentedJSON(401, gin.H{"Message": "Account not found", "success": false})
			return

		} else {
			util.Create_Send_OTP(email_id, ctx)
		}
	}
}