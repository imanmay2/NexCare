package util

import (
	"time"
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