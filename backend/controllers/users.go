package controllers

import (
	"context"
	"fmt"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/models"
	"nexcare/backend/util"
	"time"
	"net/http"
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
	if util.VerifyOTP(user.Email, user.Otp) && !user.IsLogin {
		//signup
		//generate the JWT and send it to the frontend.
		user_id := uuid.New().String()
		token, err := util.GenerateJWT(user_id, user.Email) //generated the jwt token after successful OTP verification
		if err != nil {
			ctx.IndentedJSON(500, gin.H{"Message": "Couldn't generate JWT Token", "success": false})
			return
		}
		
		// if db is not empty
		general_id:=util.Generate_General_Id(ctx,user.Name,user.Role)
		if(general_id=="NULL"){
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in generating General Id", "success": false})
			return
		}
		query := "insert into users(id,name,role,email,gen_id) values($1,$2,$3,$4,$5)"
		_, err = conn.DB.Exec(context.Background(), query, user_id, user.Name, user.Role, user.Email,general_id)
		if err != nil {
			ctx.IndentedJSON(400, gin.H{"Message": err.Error(), "success": false})
			return
		}
		//generating the refreshtoken and insert into the db
		refreshToken, err := util.GenerateRefreshToken(user_id, user.Email)
		if err != nil {
			ctx.IndentedJSON(401, gin.H{"Message": "Error in generating Refresh Tokens", "success": false})
			return
		}
		q1 := `insert into refresh_token (id,user_id,token,created_at,expires_at) values($1,$2,$3,$4,$5) `
		_, err = conn.DB.Exec(context.Background(), q1, uuid.New().String(), user_id, refreshToken, time.Now(), time.Now().Add(7*24*time.Hour))
		if err != nil {
			ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
			return
		}
		//setting up the jwt token.
		ctx.SetCookie("token", token, 60*15, "/", "localhost", false, true)
		ctx.SetCookie("refresh_token", refreshToken, 3600*24*7, "/", "localhost", false, true)
		ctx.Set("userID", user_id)
		ctx.Set("email", user.Email)
		ctx.IndentedJSON(200, gin.H{"Message": "Account Created Successfully", "success": true, "id": user_id, "role": user.Role, "name": user.Name}) //sends the jwt token to frontend
	} else if util.VerifyOTP(user.Email, user.Otp) && user.IsLogin {
		//login
		//function to fetch the user_id for passing into generate_JWT token.
		id, name, role, isOnboarded := util.GetUserDetails(user.Email)
		token, err := util.GenerateJWT(id, user.Email)
		if err != nil {
			ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		}

		refresh_token, err := util.GenerateRefreshToken(id, user.Email)
		if err != nil {
			ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		}
		log.Printf("--> Cookie Setting up...")
		ctx.SetCookie("token", token, 60*15, "/", "localhost", false, true)     
		ctx.SetCookie("refresh_token", refresh_token, 3600*24*7, "/", "localhost", false, true)
		log.Printf("<----------Cookie Set . ------>")               //setting up the token in the browser.

		 //setting up the token in the browser.

		ctx.Set("userID", id)
		ctx.Set("email", user.Email)

		ctx.IndentedJSON(200, gin.H{"id": id, "name": name, "role": role, "isOnboarded": isOnboarded})
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

// User Logout
func LogoutUser(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		ctx.IndentedJSON(404, gin.H{"Message": "Refresh Token not found in cookie", "success": false})
		return
	}

	util.DeleteRefreshToken(ctx, refreshToken)
	log.Println("--->> Refresh Token deleted from DB")

	ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
	ctx.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)

	ctx.IndentedJSON(200, gin.H{"Message": "User logged out successfully", "success": true})
}

func Me(ctx *gin.Context) {
	//fetch the user details using the userID from the token and send it to the frontend.
	refreshToken, err1 := ctx.Cookie("refresh_token")
	if err1 != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Refresh Token not found in cookie", "success": false})
		return
	}
	userID, email, err := util.VerifySignature(ctx, refreshToken)
	ctx.Set("userID", userID)
	ctx.Set("email", email)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	query := "select id,name,email,role,profile_url,gen_id,age,gender,phn_no from users where id=$1"
	row := conn.DB.QueryRow(context.Background(), query, userID)
	var user model.User
	err_ := row.Scan(&user.Id, &user.Name, &user.Email, &user.Role, &user.ProfileURL,&user.Gen_id,&user.Age,&user.Gender,&user.Phn_no)
	if err_ != nil {
		fmt.Println(err_)
		ctx.IndentedJSON(500, gin.H{"Message": err_.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"data": user, "Message": "User Data Retrieved Successfully", "success": true})
}