package util

import (
	"context"
	"log"
	"math/rand"
	conn "nexcare/backend/config"
	
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)
func GenerateOTP() string {
	//generate a random 6 digit OTP
	return strconv.Itoa(rand.Intn(900000)+100000)
}


func StoreRedisOTP(user_id string,otp string){
	// store the actual OTP with username
	err:=conn.RedisClient.Set(context.Background(),user_id,otp,time.Minute*5).Err()
	if err!=nil{
		log.Println("Couldn't Store the OTP ")
		return
	}

	redis_OTP,err:=conn.RedisClient.Get(context.Background(),user_id).Result()
	log.Println("OTP storedin Redis sucessfully--->"+redis_OTP)
}

func VerifyOTP(user_id string,otp string) bool{
	// verify OTP 
	redis_OTP,err:=conn.RedisClient.Get(context.Background(),user_id).Result()
	if err==redis.Nil{
		log.Println("User_id not found!!")
		return false
	}
	if err!=nil{
		log.Println("OTP Expired/ Not Found")
		return false
	}

	if(otp==redis_OTP){
		log.Printf("OTP Verified")
		return true
	}
	return false
}

func Create_Send_OTP(email_id string,ctx *gin.Context){
			//generate OTP
			actualOTP := GenerateOTP()
			//Store OTP in Redis
			StoreRedisOTP(email_id, actualOTP)


			//Send the otp by the email
			// err := SendEmail(email_id, actualOTP)
			// if err != nil {
			// 	ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
			// 	return
			// }

			
			ctx.IndentedJSON(200, gin.H{"Message": "OTP sent sucessfully", "success": true})
			
}