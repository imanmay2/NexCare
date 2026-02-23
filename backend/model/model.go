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

type DoctorInfo struct{
	Name string ` json:"name" binding:"required" `
	Fee int ` json:"consultation_fee" binding:"required" `
	Rating float32 ` json:"rating" binding:"required" `
	Languages string ` json:"languages" binding:"required" `
	Experience float32 ` json:"experience" binding:"required" `
	Domain string ` json:"domain" binding:"required" `
}