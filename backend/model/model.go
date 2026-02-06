package model

type User struct {
	Name string ` json:"name" binding:"required" `
	Email string ` json:"email"  binding:"required" `
	Role string ` json:"role"  binding:"required" `
	Otp string ` json:"otp" binding:"required" `
}


type UserOtp struct {
	Email string ` json:"email"  binding:"required" `
}