package model


// Models for the Users information
type User struct {
    Id         string ` json:"id"  `
    Name       string ` json:"name"  `
    Email      string ` json:"email"  `
    Role       string ` json:"role" `
    Otp        string ` json:"otp" binding:"required" `
    IsLogin    bool   ` json:"isLogin" `
    ProfileURL *string ` json:"profile_url" `
}

type UserOtp struct {
    Email   string ` json:"email"  binding:"required" `
    IsLogin bool   ` json:"isLogin"  `
}


