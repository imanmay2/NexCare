package model

// Models for the Users information
type User struct {
	Id         string  ` json:"id"  `
	Name       string  ` json:"name"  `
	Email      string  ` json:"email"  `
	Role       string  ` json:"role" `
	Otp        string  ` json:"otp" binding:"required" `
	IsLogin    bool    ` json:"isLogin" `
	ProfileURL *string ` json:"profile_url" `
	Age        int8    `  json:"age" `
	Gender     string  ` json:"gender" `
    Phn_no     string  ` json:"phn_no" `
    Gen_id     string  ` json:"gen_id" `
}

type UserOtp struct {
	Email   string ` json:"email"  binding:"required" `
	IsLogin bool   ` json:"isLogin"  `
}