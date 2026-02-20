package controllers

import (
	"context"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/model"
	"nexcare/backend/util"
	"time"

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
		//generating the refreshtoken and insert into the db
		refreshToken,err:=util.GenerateRefreshToken(user_id,user.Email); if err!=nil{
			ctx.IndentedJSON(401,gin.H{"Message":"Error in generating Refresh Tokens","success":false})
			return
		}
		q1:= `insert into refresh_token (id,user_id,token,created_at,expires_at) values($1,$2,$3,$4,$5) `
		_,err=conn.DB.Exec(context.Background(),q1,uuid.New().String(),user_id,refreshToken,time.Now(),time.Now().Add(7*24*time.Hour)); if err!=nil{
			ctx.IndentedJSON(500,gin.H{"Message" : err.Error(),"success":false})
			return
		}
		query := "insert into users values($1,$2,$3,$4)"
		_, err = conn.DB.Exec(context.Background(), query, user_id, user.Name, user.Role, user.Email)
		if err != nil {
			ctx.IndentedJSON(400, gin.H{"Message": err.Error(), "success": false})
			return
		}
		//setting up the jwt token. 
		ctx.SetCookie("token",token,60*15,"/","localhost",false,true)
		ctx.SetCookie("refresh_token",refreshToken,3600*24*7,"/","localhost",false,true)
		ctx.IndentedJSON(200, gin.H{"Message": "Account Created Successfully", "success": true,"role":user.Role,"name":user.Name}) //sends the jwt token to frontend
	}else if(util.VerifyOTP(user.Email, user.Otp)  && user.IsLogin){
		//login
		//function to fetch the user_id for passing into generate_JWT token. 
		id,name,role:=util.GetUserDetails(user.Email)
		token,err:=util.GenerateJWT(id,user.Email);if err!=nil{
			ctx.IndentedJSON(500,gin.H{"Message":err.Error(),"success":false})
		}

		refresh_token,err:=util.GenerateRefreshToken(id,user.Email); if err!=nil{
			ctx.IndentedJSON(500,gin.H{"Message":err.Error(),"success":false})
		}
		ctx.SetCookie("token",token,3600*24,"/","localhost",false,true) //setting up the token in the browser. 
		ctx.SetCookie("refresh_token",refresh_token,3600*24*7,"/","localhost",false,true) //setting up the token in the browser. 

		ctx.IndentedJSON(200,gin.H{"name":name,"role":role}) 
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

func SetAccessToken(ctx *gin.Context){

	refresh_token,err:=ctx.Cookie("refresh_token"); if err!=nil{
		ctx.IndentedJSON(404,gin.H{"Message":"Refresh Token not found","success":false})
		return
	}
	//verify signature of the refresh token 
	user_id,email,err:=util.VerifySignature(ctx,refresh_token) 
	query:=` select exists(select 1 from refresh_token where token=$1) `
	var exist bool
	err=conn.DB.QueryRow(context.Background(),query,refresh_token).Scan(&exist)
	if err!=nil || !exist {
		ctx.IndentedJSON(404,gin.H{"Message":"Token not found in DB , Re-register","success":false})
		//frontend will redirect to the login page.
		return
	}
	//generate a new access token as refresh token is matched from db.
	newToken,err:=util.GenerateJWT(user_id,email)
	ctx.SetCookie("token",newToken,60*15,"/","localhost",false,true)
	ctx.IndentedJSON(200,gin.H{"Message": "Access Token Refreshed","success":true})
	//now again recall the same function from frontend so as to avoid multiple signup/login
}


//User Logout 
func LogoutUser(ctx *gin.Context){

	// token,err:=ctx.Cookie("token");if(err!=nil){
	// 	ctx.IndentedJSON(404,gin.H{"Message":"Access Token not found in cookie","success":false})
	// 	return
	// }

	refreshToken,err:=ctx.Cookie("refresh_token");if err!=nil{
		ctx.IndentedJSON(404,gin.H{"Message":"Refresh Token not found in cookie","success":false})
		return
	}

	util.DeleteRefreshToken(ctx,refreshToken)
	log.Println("--->> Refresh Token deleted from DB")

	ctx.SetCookie("token","",-1,"/","localhost",false,true)
	ctx.SetCookie("refresh_token","",-1,"/","localhost",false,true)

	ctx.IndentedJSON(200,gin.H{"Message":"User logged out successfully","success":true})
}