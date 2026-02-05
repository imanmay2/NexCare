package util

import (
	"math/rand"
)
func GenerateOTP() int {
	//generate a random 6 digit OTP
	return rand.Intn(900000)+100000
}


func StoreRedisOTP(){
	//
}

func VerifyOTP(){
	//
}