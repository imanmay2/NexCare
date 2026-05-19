package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	conn "nexcare/backend/config"
	"nexcare/backend/models"
	"nexcare/backend/util"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func GetSchedule(ctx *gin.Context) {
	// Get the time schedule of the doctor
	// GET THE id from token
	userId, err_ := util.GetUserIdFromToken(ctx)
	fmt.Println("User ID from token:", userId)
	if err_ != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err_.Error(), "success": false})
		return
	}
	query := "select availability from doctor where d_id=$1"
	row := conn.DB.QueryRow(context.Background(), query, userId)
	var availability json.RawMessage
	err := row.Scan(&availability)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"availability": availability, "Message": "Doctor Schedule Retrieved Successfully", "success": true})
}

func SetSchedule(ctx *gin.Context) {
	// Set the time schedule of the doctor
	var doctorSchedule model.DoctorSchedule
	err := ctx.ShouldBindJSON(&doctorSchedule)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	query := "update doctor set availability=$1 where d_id=$2"
	_, err = conn.DB.Exec(context.Background(), query, doctorSchedule.Availability, doctorSchedule.D_id)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Doctor Schedule Updated Successfully", "success": true})
}

func GetInfo(ctx *gin.Context) {
	// Get the doctor info like profile data and professional data as well.

	userID, err := util.GetUserIdFromToken(ctx)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false, "isOnBoarded": false})
		return
	}
	query := "select d.d_id, u.name, d.consultation_fee, d.rating, d.languages, d.experience, d.domain, d.availability,d.hospital from doctor d inner join users u on d.d_id = u.id where d.d_id=$1"
	row := conn.DB.QueryRow(context.Background(), query, userID)
	var doctorInfo model.DoctorInfo
	err_ := row.Scan(&doctorInfo.D_id, &doctorInfo.Name, &doctorInfo.Fee, &doctorInfo.Rating, &doctorInfo.Languages, &doctorInfo.Experience, &doctorInfo.Domain, &doctorInfo.Availability, &doctorInfo.Hospital)
	if err_ != nil {
		fmt.Println("Doctor Info found from DB", err_)
		if errors.Is(err_, pgx.ErrNoRows) {
			ctx.IndentedJSON(200, gin.H{"Message": "Doctor not onboarded", "success": true, "isOnBoarded": false})
			return
		}
		ctx.IndentedJSON(500, gin.H{"Message": err_.Error(), "success": false, "isOnBoarded": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"data": doctorInfo, "Message": "Doctor Info Retrieved Successfully", "success": true, "isOnBoarded": true})
}

func AddProfileData(ctx *gin.Context) {
	// Add the profile data and professional data of the doctor
	var doctorInfo model.DoctorInfo
	err := ctx.ShouldBindJSON(&doctorInfo)
	if err != nil {
		fmt.Println("Error in data retrieval:", err)
		ctx.IndentedJSON(500, gin.H{"Message": "Error in data retrieval", "success": false})
		return
	}
	query := "insert into doctor (id,d_id, consultation_fee, rating, languages, experience, domain) values ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (d_id) DO NOTHING"
	_, err = conn.DB.Exec(context.Background(), query, uuid.NewString(), doctorInfo.D_id, doctorInfo.Fee, doctorInfo.Rating, doctorInfo.Languages, doctorInfo.Experience, doctorInfo.Domain)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Doctor Profile Data Added Successfully", "success": true})
}

func UpdateProfileData(ctx *gin.Context) {
	// Update the professional data of the doctor
	var doctorInfo model.DoctorInfo
	query := "update doctor set consultation_fee=$1,rating=$2,languages=$3,experience=$4,domain=$5,hospital=$6 where d_id=$7"
	err := ctx.ShouldBindJSON(&doctorInfo)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	_, err = conn.DB.Exec(context.Background(), query, doctorInfo.Fee, doctorInfo.Rating, doctorInfo.Languages, doctorInfo.Experience, doctorInfo.Domain, doctorInfo.Hospital, doctorInfo.D_id)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}

	query = "update users set name=$1 where id=$2"
	_, err = conn.DB.Exec(context.Background(), query, doctorInfo.Name, doctorInfo.D_id)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Doctor Info Updated Successfully", "success": true})
}

func GetAppointments() {
	// Get the list of appointments for the doctor

}

func GetPatientMedicalRecords(ctx *gin.Context) {
	patientId := ctx.Query("p_id")
	// Get the medical records of the selected patient
	query := "select u.name, u.age, u.gen_id, m.blood_type, m.allergies, m.medical_conditions, m.current_medications, m.family_history, m.surgical_history, v.bp, v.temp, v.weight, v.height, v.heart_rate, v.spo2, v.created_at from health_summary m inner join users u on m.p_id = u.id inner join health_metrics v on v.p_id = u.id where u.gen_id=$1 order by v.created_at desc limit 1" // need to select the latest health metrics of the patient based on the created_at field in health_metrics table
	row := conn.DB.QueryRow(context.Background(), query, patientId)
	var medicalRecord model.PatientMedicalRecord
	err := row.Scan(&medicalRecord.Name, &medicalRecord.Age, &medicalRecord.Gen_id, &medicalRecord.Blood_Type, &medicalRecord.Allergies, &medicalRecord.Medical_Conditions, &medicalRecord.Current_Medications, &medicalRecord.Family_History, &medicalRecord.Surgical_History, &medicalRecord.Bp, &medicalRecord.Temp, &medicalRecord.Weight, &medicalRecord.Height, &medicalRecord.Heart_Rate, &medicalRecord.SpO2, &medicalRecord.Created_At)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"data": medicalRecord, "Message": "Patient Medical Record Retrieved Successfully", "success": true})

}

func UploadProfilePic(ctx *gin.Context) {
	userID := ctx.MustGet("userID").(string)

	file, err := ctx.FormFile("image")
	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Open file
	src, err := file.Open()
	if err != nil {
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "File error"})
		return
	}
	defer src.Close()

	fileExt := filepath.Ext(file.Filename)
	fileName := userID + fileExt
	filePath := "doctors/" + fileName

	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	uploadUrl := fmt.Sprintf("%s/storage/v1/object/profile-pictures/%s", supabaseUrl, filePath)

	req, _ := http.NewRequest("PUT", uploadUrl, src)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", file.Header.Get("Content-Type"))
	req.Header.Set("x-upsert", "true")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode >= 300 {
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Upload failed", "success": false})
		return
	}

	publicUrl := fmt.Sprintf("%s/storage/v1/object/public/profile-pictures/%s", supabaseUrl, filePath)

	// Save URL in PostgreSQL

	query := "update users set profile_url=$1 where id=$2"
	_, err = conn.DB.Exec(context.Background(), query, publicUrl, userID)
	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(http.StatusOK, gin.H{
		"Message": "Uploaded successfully",
		"url":     publicUrl,
		"success": true,
	})
}

func DeleteProfilePic(ctx *gin.Context) {
	userID := ctx.MustGet("userID").(string)

	var profileURL string
	err := conn.DB.QueryRow(
		context.Background(),
		"SELECT profile_url FROM users WHERE id=$1",
		userID,
	).Scan(&profileURL)

	if err != nil || profileURL == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"Message": "No profile picture found",
			"success": false,
		})
		return
	}

	// Extract file path
	parts := strings.Split(profileURL, "/profile-pictures/")
	if len(parts) != 2 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"Message": "Invalid profile URL format",
			"success": false,
		})
		return
	}

	filePath := parts[1]

	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	deleteURL := fmt.Sprintf(
		"%s/storage/v1/object/profile-pictures/%s",
		supabaseUrl,
		filePath,
	)

	req, _ := http.NewRequest("DELETE", deleteURL, nil)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode >= 300 {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"Message": "Delete failed",
			"success": false,
		})
		return
	}
	defer resp.Body.Close()

	// Clear DB
	_, _ = conn.DB.Exec(
		context.Background(),
		"UPDATE users SET profile_url=NULL WHERE id=$1",
		userID,
	)

	ctx.JSON(http.StatusOK, gin.H{
		"Message": "Profile picture deleted",
		"success": true,
	})
}
