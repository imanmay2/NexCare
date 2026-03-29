package model

import (
	"encoding/json"
	"time"
)

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

// Models for the Doctor Information
type DoctorInfo struct {
	D_id         string          ` json:"d_id" binding:"required" `
	Name         string          ` json:"name" binding:"required" `
	Fee          int             ` json:"consultation_fee" binding:"required" `
	Rating       float32         ` json:"rating" `
	Languages    string          ` json:"languages" binding:"required" `
	Experience   float32         ` json:"experience" binding:"required" `
	Availability json.RawMessage ` json:"availability" `
	Domain       string          ` json:"domain" binding:"required" `
	Hospital     string          ` json:"hospital" `
}

type DoctorSchedule struct {
	D_id         string          ` json:"d_id" binding:"required" `
	Availability json.RawMessage ` json:"availability" binding:"required" `
}

type Appointment struct{
	Id string ` json:"id" binding:"required" `
	D_id string ` json:"d_id"  binding:"required" `
	Date time.Time ` json:"date" binding:"required" `
	DoctorName string ` json:"doctorName" binding:"required" `
	Status string ` json:"status" binding:"required" `
	Symptom string ` json:"symptoms" binding:"required" `
	Time time.Time ` json:"time" binding:"required" `
	Type string ` json:"type" binding:"required" `
}

type BloodPressure struct{
	Sys int64 ` json:"sys" `
	Dia int64 ` json:"dia" `
}

type Health_Metrics struct{
	Id string ` json:"id" `
	P_id string ` json:"p_id"  binding:"required" `
	Bp BloodPressure ` json:"bp"  binding:"required" `
	Temp float64 ` json:"temp"  binding:"required" `
	Heart_Rate int64 ` json:"heart_rate"  binding:"required" `
	Weight float64 ` json:"weight"  binding:"required" `
	Height float64 ` json:"height"  binding:"required" `
	Created_At time.Time ` json:"created_at" `
}