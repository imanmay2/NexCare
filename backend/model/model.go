package model

type User struct {
	Name string ` json:"name"  `
	Email string ` json:"email"  `
	Role string ` json:"role" `
	Otp string ` json:"otp" binding:"required" `
	IsLogin bool ` json:"isLogin" `
}


type UserOtp struct {
	Email string ` json:"email"  binding:"required" `
	IsLogin bool ` json:"isLogin"  `
}