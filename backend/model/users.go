package model

type UserData struct{
	Id string ` json:"id" binding:"required" `
	Name string ` json:"name" binding:"required" `
	Phn_no int ` json:"phn_no" binding:"required" `
	Role string ` json:"role" binding:"required" `
}