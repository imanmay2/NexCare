package controllers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	conn "nexcare/backend/config"
	model "nexcare/backend/models"
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

func GetAppointments(ctx *gin.Context) {
	//get the  upcoming appointment details for doctor
	userID := ctx.GetString("userID")
	fmt.Println(userID)
	q1 := "select a.id,	a.p_id, a.date, u.name, u.age, u.gender, u.profile_url, a.status, a.symptoms, a.time, a.consultation_type from users u inner join appointment a on u.id=a.p_id where a.d_id=$1  AND a.date >= CURRENT_DATE"
	rows, err := conn.DB.Query(context.Background(), q1, userID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Error in fetching upcoming appointment", "success": false})
		return
	}

	var appointmentData []model.DoctorAppointment
	for rows.Next() {
		//upcoming.
		var appointment model.DoctorAppointment
		var profileUrl sql.NullString
		if err := rows.Scan(&appointment.Id,
			&appointment.P_id,
			&appointment.Date,
			&appointment.PatientName,
			&appointment.Age,
			&appointment.Gender,
			&profileUrl,
			&appointment.Status,
			&appointment.Symptom,
			&appointment.Time,
			&appointment.Type); err != nil {
			fmt.Println(err.Error())
			continue
		}
		if profileUrl.Valid {
			appointment.ProfileURL = profileUrl.String
		}
		appointmentData = append(appointmentData, appointment)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Data fetched successfully", "success": true, "data": appointmentData})

}

func GetPatientMedicalRecords(ctx *gin.Context) {
	patientId := ctx.Query("p_id")
	// Get the medical records of the selected patient
	query := "select u.name, u.age, u.gender, u.gen_id, m.blood_type, m.allergies, m.medical_conditions, m.current_medications, m.family_history, m.surgical_history, m.menstrual_history, m.lmp, coalesce(v.bp, '{}'::jsonb) as bp, coalesce(v.temp, 0) as temp, coalesce(v.weight, 0) as weight, coalesce(v.height, 0) as height, coalesce(v.heart_rate, 0) as heart_rate, coalesce(v.spo2, 0) as spo2, coalesce(v.created_at, '1970-01-01 00:00:00+00'::timestamp) as created_at from health_summary m inner join users u on m.p_id = u.id left join health_metrics v on v.p_id = u.id where u.gen_id=$1 order by coalesce(v.created_at, '1970-01-01 00:00:00+00'::timestamp) desc limit 1"
	row := conn.DB.QueryRow(context.Background(), query, patientId)
	var medicalRecord model.PatientMedicalRecord
	err := row.Scan(&medicalRecord.Name, &medicalRecord.Age, &medicalRecord.Gender, &medicalRecord.Gen_id, &medicalRecord.Blood_Type, &medicalRecord.Allergies, &medicalRecord.Medical_Conditions, &medicalRecord.Current_Medications, &medicalRecord.Family_History, &medicalRecord.Surgical_History, &medicalRecord.Menstrual_History, &medicalRecord.LMP, &medicalRecord.Bp, &medicalRecord.Temp, &medicalRecord.Weight, &medicalRecord.Height, &medicalRecord.Heart_Rate, &medicalRecord.SpO2, &medicalRecord.Created_At)
	if err != nil {
		if err == pgx.ErrNoRows {
			ctx.IndentedJSON(204, gin.H{"Message": "No medical record found for the patient", "success": false})
			return
		}
		fmt.Println(err)
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"data": medicalRecord, "Message": "Patient Medical Record Retrieved Successfully", "success": true})

}

func UpdatePatientMedicalRecords(ctx *gin.Context) {
	// Update the medical records of the selected patient
	var medicalRecord model.PatientMedicalRecord
	err := ctx.ShouldBindJSON(&medicalRecord)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	query := "update health_summary set blood_type=$1,allergies=$2,medical_conditions=$3,current_medications=$4,family_history=$5,surgical_history=$6,menstrual_history=$7,lmp=$8 where p_id=(select id from users where gen_id=$9)"
	_, err = conn.DB.Exec(context.Background(), query, medicalRecord.Blood_Type, medicalRecord.Allergies, medicalRecord.Medical_Conditions, medicalRecord.Current_Medications, medicalRecord.Family_History, medicalRecord.Surgical_History, medicalRecord.Menstrual_History, medicalRecord.LMP, medicalRecord.Gen_id)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Patient Medical Record Updated Successfully", "success": true})
}

func AddPatientMedicalRecords(ctx *gin.Context) {
	// Add the medical records of the selected patient
	var medicalRecord model.PatientMedicalRecord
	err := ctx.ShouldBindJSON(&medicalRecord)
	if err != nil {
		fmt.Println("Error here: ", err)
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	query := "insert into health_summary (id,p_id,blood_type,allergies,medical_conditions,current_medications,family_history,surgical_history,menstrual_history,lmp) values ($1,(select id from users where gen_id=$2),$3,$4,$5,$6,$7,$8,$9,$10)"
	_, err = conn.DB.Exec(context.Background(), query, uuid.NewString(), medicalRecord.Gen_id, medicalRecord.Blood_Type, medicalRecord.Allergies, medicalRecord.Medical_Conditions, medicalRecord.Current_Medications, medicalRecord.Family_History, medicalRecord.Surgical_History, medicalRecord.Menstrual_History, medicalRecord.LMP)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Patient Medical Record Added Successfully", "success": true})
}

func AddPatientVitals(ctx *gin.Context) {
	// Add the vitals of the selected patient
	gen_id := ctx.Query("gen_id")
	var healthMetrics model.Health_Metrics
	err := ctx.ShouldBindJSON(&healthMetrics)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	query := "insert into health_metrics (id,p_id,bp,temp,heart_rate,weight,height,spo2) values ($1,(select id from users where gen_id=$2),$3,$4,$5,$6,$7,$8)"
	_, err = conn.DB.Exec(context.Background(), query, uuid.NewString(), gen_id, healthMetrics.Bp, healthMetrics.Temp, healthMetrics.Heart_Rate, healthMetrics.Weight, healthMetrics.Height, healthMetrics.Spo2)
	if err != nil {
		fmt.Println(err)
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Patient Vitals Added Successfully", "success": true})
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
