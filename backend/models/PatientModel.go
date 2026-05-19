package model

import (
    "time"
)


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
    Id string ` json:"id" binding:"required"`
    Bp BloodPressure ` json:"bp"  binding:"required" `
    Temp float64 ` json:"temp"  binding:"required" `
    Heart_Rate int64 ` json:"heart_rate"  binding:"required" `
    Weight float64 ` json:"weight"  binding:"required" `
    Height float64 ` json:"height"  binding:"required" `
    Created_At time.Time ` json:"created_at" `
}

type Contacts struct{
    Name string ` json:"name" `
    Phn_no string `json:"phn_no" `
    Relation string ` json:"relation" `
}

type Menstrual struct{
    Flow string ` json:"flow" `
    Amount string ` json:"amount" `
    Duration string ` json:"duration" `
    Menarche string ` json:"menarche" `
    Regularity string ` json:"regularity" `
    Associated_Symptoms string ` json:"associated_symptoms" `
}

type HealthSummary struct{
    Id string ` json:"id" binding:"required" `
    Created_At time.Time `json:"created_at"`
    Blood_Type string ` json:"blood_type" binding:"required" `
    Allergies string ` json:"allergies" binding:"required" `
    Insurance string ` json:"insurance" binding:"required" `
    Contact []Contacts ` json:"contacts" binding:"required" `
    Family_History string ` json:"family_history" `
    Surgical_History string ` json:"surgical_history" `
    Current_Medication string ` json:"current_medications" `
    Medical_Conditions string ` json:"medical_conditions" `
    Menstrual_History []Menstrual ` json:"menstrual_history" `
    Imp time.Time ` json:"imp" `
}

type DrugType struct {
	Name string ` json:"name" `
	Dosage string ` json:"dosage" `
	Duration string ` json:"duration" `
	Frequency string ` json:"frequency" `
    Instruction string ` json:"instruction" `
}

type Consultation struct{
	Id string ` json:"id" binding:"required" `
	Created_At time.Time ` json:"created_at" `
	// A_id string ` json:"a_id" binding:"required" `
	Title string ` json:"title" binding:"required" `
	Symptoms string ` json:"symptoms" binding:"required" `
	Diagnosis string ` json:"diagnosis" binding:"required" `
	Treatment string ` json:"treatment" binding:"required" `
	Physical_examination string ` json:"physical_examination" binding:"required" `
	Drug []DrugType ` json:"drug" binding:"required" `
	Investigations string ` json:"investigations" `
}

type PatientMedicalRecord struct {
    Created_At time.Time `json:"created_at"`
    Name string ` json:"name" binding:"required" `
    Age int64 ` json:"age" binding:"required" `
    Gen_id string ` json:"gen_id" binding:"required" `
    Blood_Type string ` json:"blood_type" `
    Allergies string ` json:"allergies" `
    Medical_Conditions string ` json:"medical_conditions" `
    Current_Medications string ` json:"current_medications" `
    Family_History string ` json:"family_history" `
    Surgical_History string ` json:"surgical_history" `
    Bp BloodPressure ` json:"bp" `
    Temp float64 ` json:"temp" `
    Heart_Rate int64 ` json:"heart_rate" `
    Weight float64 ` json:"weight" `
    Height float64 ` json:"height" `
    SpO2 int64 ` json:"spo2" `
}