package model

import (
	"encoding/json"
	"time"
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

type DoctorAppointment struct {
	Id          string    ` json:"id" binding:"required" `
	P_id        string    ` json:"p_id"  binding:"required" `
	Date        time.Time ` json:"date" binding:"required" `
	PatientName string    ` json:"patientName" binding:"required" `
	Age         int       ` json:"patientAge" binding:"required" `
	Gender      string    ` json:"gender" binding:"required" `
	ProfileURL  string    ` json:"profile_url" binding:"required" `
	Status      string    ` json:"status" binding:"required" `
	Symptom     string    ` json:"symptoms" binding:"required" `
	Time        time.Time ` json:"time" binding:"required" `
	Type        string    ` json:"type" binding:"required" `
}

type PatientMedicalRecord struct {
	Created_At          time.Time     `json:"created_at"`
	Name                string        ` json:"name" binding:"required" `
	Age                 int64         ` json:"age" binding:"required" `
	Gender              string        ` json:"gender" binding:"required" `
	Gen_id              string        ` json:"gen_id" binding:"required" `
	Blood_Type          string        ` json:"blood_type" `
	Allergies           string        ` json:"allergies" `
	Medical_Conditions  string        ` json:"medical_conditions" `
	Current_Medications string        ` json:"current_medications" `
	Family_History      string        ` json:"family_history" `
	Surgical_History    string        ` json:"surgical_history" `
	LMP                 time.Time     ` json:"lmp"`
	Menstrual_History   Menstrual     ` json:"menstrual_history" `
	Bp                  BloodPressure ` json:"bp" `
	Temp                float64       ` json:"temp" `
	Heart_Rate          int64         ` json:"heart_rate" `
	Weight              float64       ` json:"weight" `
	Height              float64       ` json:"height" `
	SpO2                int64         ` json:"spo2" `
}

type Medicine struct{
	Name string ` json:"name" binding:"required" `
	Dosage string ` json:"dosage" binding:"required" `
	Frequency string ` json:"frequency" binding:"required" `
	Duration string ` json:"duration" binding:"required" `
	DosageUnit string ` json:"dosageUnit" binding:"required" `
	Form string ` json:"form" binding:"required" `
	DurationUnit string ` json:"durationUnit" binding:"required" `
	FoodInstructions string ` json:"foodInstructions" binding:"required" `
	Instructions string ` json:"instructions" binding:"required" `
}


type Prescription struct{
	A_id string ` json:"a_id" binding:"required" `
	Title string ` json:"title" binding:"required" `
	Diagnosis string ` json:"diagnosis" binding:"required" `
	Treatment string ` json:"treatment" ` //same as general instruction
	Symptoms string ` json:"symptoms" binding:"required" `
	Physical_Examination string ` json:"physical_examination"  `
	Drug []Medicine ` json:"drug" binding:"required" `
	Investigation string ` json:"investigations" `
	Summary string ` json:"summary" binding:"required" `
	Follow_Up_Date time.Time ` json:"follow_up_date"  `
	Status string ` json:"status" binding:"required" `
	Finalized_At time.Time ` json:"finalizedAt"  `
}

type AppointmentDetails struct{
	Id string 
	P_id string 
	Name string 
	Age int8 
	Gender string 
}