package util

import (
	"context"
	"fmt"
	"strconv"
	"time"
	conn "nexcare/backend/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)


var SecretKey=[]byte("nexcare__secret__key") //store this in the .env file.

func GenerateJWT(userid string,email string) (string,error){
	claims:=jwt.MapClaims{
		"user_id":userid,
		"email":email,
		"exp":time.Now().Add(time.Hour*24).Unix(),
	}

	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString,err:=token.SignedString(SecretKey)
	if err!=nil{
		return "",err
	}

	return tokenString,nil
}


func GenerateRefreshToken(userid string,email string) (string,error){

	claims:=jwt.MapClaims{
		"user_id":userid,
		"email":email,
		"exp":time.Now().Add(time.Hour*24).Unix(),
	}

	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString,err:=token.SignedString(SecretKey)
	if err!=nil{
		return "",err
	}

	return tokenString,nil
} 

//verifying  signature for the refresh-token
func VerifySignature(ctx *gin.Context,tokenString string) (string,string,error){
	token,err:=jwt.Parse(tokenString,func(token *jwt.Token)(interface{},error){
			return SecretKey,nil
		})

		if err!=nil || !token.Valid{

			//delete the refresh-token from db
			q1:=`delete from refresh_token where token=$1 `
			_,err=conn.DB.Exec(context.Background(),q1,tokenString); if err!=nil{
				fmt.Println("---->Refresh token couldn't be deleted from the db")
			}
			ctx.IndentedJSON(401,gin.H{"Message":"Refresh-Token Expired","success":false})
			ctx.Abort()
			return "","",err
		}

		claims := token.Claims.(jwt.MapClaims)

	userID := int(claims["user_id"].(float64))
	email := claims["email"].(string)
	return strconv.Itoa(userID),email,nil
}