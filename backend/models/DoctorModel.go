package model

import (
    "encoding/json"
)

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