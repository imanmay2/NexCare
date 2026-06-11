package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	conn "nexcare/backend/config"
	"nexcare/backend/models"
	// "os/user"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	ai "nexcare/backend/AI"
	"time"
)

func GetPatientInfo(ctx *gin.Context) {
	ctx.IndentedJSON(200, gin.H{"Message": "Welcome Mr. ", "success": true})
}

func GetDoctorInfo(ctx *gin.Context) {
	q1 := ` select d.d_id,u.name,d.consultation_fee,d.rating,d.languages,d.experience,d.domain,d.availability from users u inner join doctor d on u.id=d.d_id `
	var doctorData []model.DoctorInfo
	rows, err := conn.DB.Query(context.Background(), q1)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}

	for rows.Next() {
		var doc model.DoctorInfo
		rows.Scan(&doc.D_id, &doc.Name, &doc.Fee, &doc.Rating, &doc.Languages, &doc.Experience, &doc.Domain, &doc.Availability)
		doctorData = append(doctorData, doc)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Doctor Data fetched successfully", "success": true, "data": doctorData})
}

func GetAppointment(ctx *gin.Context) {
	//get the  upcoming appointment details for patients
	userID := ctx.GetString("userID")
	q1 := " select a.id,a.d_id,a.date,u.name,a.status,a.symptoms,a.time,a.consultation_type from users u inner join appointment a on u.id=a.d_id where u.role=$1 and p_id=$2"
	rows, err := conn.DB.Query(context.Background(), q1, "doctor", userID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Error in fetching upcoming appointment", "success": false})
		return
	}

	var appointmentData []model.Appointment
	for rows.Next() {
		//upcoming.
		var appointment model.Appointment
		rows.Scan(&appointment.Id, &appointment.D_id, &appointment.Date, &appointment.DoctorName, &appointment.Status, &appointment.Symptoms, &appointment.Time, &appointment.Type)
		appointmentData = append(appointmentData, appointment)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Data fetched successfully", "success": true, "data": appointmentData})
}

// fetch all the boookings for that particular date.
func GetAllAppointmentDetails(ctx *gin.Context) {
	//get the upcoming appointment details for patients
	date, err := time.Parse("2006-01-02", "2026-06-11")
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Invalid date format", "success": false})
		return
	}
	// userID := ctx.GetString("userID")
	var selectedTime []time.Time
	q1 := " select time from appointment where status='upcoming' AND date=$1 "
	rows, err := conn.DB.Query(context.Background(), q1, date)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Error in fetching all appointment details", "success": false})
		return
	}

	for rows.Next() {
		var t time.Time
		rows.Scan(&t)
		selectedTime = append(selectedTime, t)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Selected times fetched successfully", "success": true, "data": selectedTime})
}

func PostAppointment(ctx *gin.Context) {
	// fmt.Println("check ck 0")
	// post request for feeding the appointment details into the database
	var appointmentDetails model.Appointment
	err := ctx.ShouldBindJSON(&appointmentDetails)
	// fmt.Println("check ck 1")
	if err != nil {
		fmt.Println("check ck 1")
			
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}

	dateObj, err := time.Parse("2006-01-02", appointmentDetails.Date)
	if err != nil {
		fmt.Println("check ck 2")
		fmt.Println(err.Error())
		ctx.IndentedJSON(400, gin.H{
			"Message": "Invalid date format",
			"success": false,
		})
		return
	}

	timeObj, err := time.Parse("15:04", appointmentDetails.Time)
	if err != nil {
		fmt.Println("check ck 3")
		fmt.Println(err.Error())
		ctx.IndentedJSON(400, gin.H{
			"Message": "Invalid time format",
			"success": false,
		})
		return
	}
	//push the data in the appointment table.
	p_id := ctx.GetString("userID")
	q2 := `insert into appointment values($1,$2,$3,$4,$5,$6,$7,$8)`
	fmt.Println("check ck 4")
	_, err = conn.DB.Exec(context.Background(), q2, uuid.NewString(), p_id, appointmentDetails.D_id, dateObj, timeObj, appointmentDetails.Status, appointmentDetails.Type, appointmentDetails.Symptoms)
	if err != nil {
		fmt.Println("check ck 5")
		fmt.Println(err.Error())
		ctx.IndentedJSON(500, gin.H{"Message": "Could insert data in the appointment table", "success": false})
		return
	}
	fmt.Println("check ck 6")
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Booked Successfully", "success": true})
}

func GetHealthMetrics(ctx *gin.Context) {
	fmt.Println("<---->Welcome to Health Metrics<----->")
	user_ID := ctx.GetString("userID")
	q1 := ` select id,bp,temp,heart_rate,weight,height,created_at from health_metrics where p_id= $1 `
	rows, err := conn.DB.Query(context.Background(), q1, user_ID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	//if no error
	var HealthMetrics_Data []model.Health_Metrics
	for rows.Next() {
		var metrices model.Health_Metrics
		rows.Scan(&metrices.Id, &metrices.Bp, &metrices.Temp, &metrices.Heart_Rate, &metrices.Weight, &metrices.Height, &metrices.Created_At)
		HealthMetrics_Data = append(HealthMetrics_Data, metrices)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Health Metrics Data fetched. ", "success": true, "data": HealthMetrics_Data})
	//create a model in frontend also.
}

func GetHealthSummary(ctx *gin.Context) {
	fmt.Println("Welcome to Health Summary")
	userID := ctx.GetString("userID")
	q1 := ` select id,created_at,blood_type,allergies,insurance,contacts,family_history,surgical_history,current_medications,medical_conditions,menstrual_history,lmp from health_summary where p_id=$1 `
	rows, err := conn.DB.Query(context.Background(), q1, userID)
	if err != nil {
		fmt.Println("Error Encountered ")
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	var summary []model.HealthSummary
	for rows.Next() {
		var contactData []byte
		var menstrualData []byte
		var summ model.HealthSummary
		rows.Scan(&summ.Id, &summ.Created_At, &summ.Blood_Type, &summ.Allergies, &summ.Insurance, &contactData, &summ.Family_History, &summ.Surgical_History, &summ.Current_Medication, &summ.Medical_Conditions, &menstrualData, &summ.Lmp)
		if contactData != nil {
			err := json.Unmarshal(contactData, &summ.Contact)
			if err != nil {
				fmt.Println("Error occured at Contact unmarshal : ", err.Error())
				return
			}
		}
		if menstrualData != nil {
			err := json.Unmarshal(menstrualData, &summ.Menstrual_History)
			if err != nil {
				fmt.Println("Error occured in menstrual unmarshal : ", err.Error())
				return
			}
		}
		summary = append(summary, summ)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Health Summary", "success": true, "data": summary})
}

func GetConsultationData(ctx *gin.Context) {
	fmt.Println("Welcome to Consultation Data")
	userID := ctx.GetString("userID")
	q1 := ` select c.id,c.created_at,c.title,c.symptoms,c.diagnosis,c.treatment,c.physical_examination,c.drug,c.investigations,c.summary,u.name from consultation c inner join appointment a on a.id=c.a_id inner join users u on a.d_id=u.id where a.p_id= $1 `
	rows, err := conn.DB.Query(context.Background(), q1, userID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	var consultData []model.Consultation
	var drugData []byte
	for rows.Next() {
		var data model.Consultation
		err := rows.Scan(&data.Id, &data.Created_At, &data.Title, &data.Symptoms, &data.Diagnosis, &data.Treatment, &data.Physical_examination, &drugData, &data.Investigations, &data.Summary, &data.Name)
		if err != nil {
			fmt.Println("Error occured ", err.Error())
			return
		}
		if drugData != nil {
			err := json.Unmarshal(drugData, &data.Drug)
			if err != nil {
				fmt.Println("Error at drug : ", err.Error())
				return
			}
		}
		consultData = append(consultData, data)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Data Found", "data": consultData, "success": true})
}

// / fetch the lab result for the particular patient.
func GetLabResults(ctx *gin.Context) {
	userID := ctx.GetString("userID") // patient_id
	query := ` select lr.id,lr.p_id,lr.d_id,lr.test_group,lr.created_at,lr.summary,u.name,jsonb_object_agg(tv.key,jsonb_build_object('value',tv.value,'min',rr.min_value,'max',rr.max_value,'unit',rr.unit)) as results from lab_result lr join test_values tv on tv.id=ANY(lr.test_id) join min_max rr on LOWER(TRIM(tv.key))=LOWER(TRIM(rr.test_name)) inner join users u on u.id=lr.d_id where p_id=$1 group by lr.id,u.name `
	row, err := conn.DB.Query(context.Background(), query, userID)
	if err != nil {
		fmt.Println("Error in fetching lab result : ", err.Error())
		ctx.IndentedJSON(500, gin.H{"Message": "Error in fetching lab result", "success": false})
		return
	}
	var results []model.LabResult
	var rawjson []byte
	for row.Next() {
		var data model.LabResult
		err := row.Scan(&data.Id, &data.P_id, &data.D_id, &data.Test_group, &data.Created_At, &data.Summary, &data.Name, &rawjson)
		if err != nil {
			fmt.Printf("Error in scanning lab result : %s", err.Error())
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in fetching lab result", "success": false})
			return
		}
		err = json.Unmarshal(rawjson, &data.Results)
		if err != nil {
			fmt.Println("Error in unmarshal in lab results ", err.Error())
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in unmarshal of lab result", "success": false})
			return
		}
		results = append(results, data)
	}
	ctx.IndentedJSON(http.StatusOK, gin.H{"Message": "Lab Result fetched successfully", "data": results, "success": true})
}

// Controller for the AI Symptom Checker..
func SymptomChecker(ctx *gin.Context) {
	var userInput struct {
		Symptoms string `json:"symptoms" `
	}
	err := ctx.ShouldBindJSON(&userInput)
	if err != nil {
		fmt.Println("Error in binding the user input : ", err.Error())
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"Message": "Invalid input", "success": false})
		return
	}

	//call the function to analyze the symptoms and get the result.
	fmt.Println("User input : ", userInput.Symptoms)
	resp, flag := ai.AnalyzeSymptom(userInput.Symptoms)
	if !flag {
		fmt.Println("Error in analyzing the symptoms")
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in analyzing the symptoms", "success": false})
		return
	}

	var result model.SymptomResult
	err = json.Unmarshal([]byte(resp), &result)
	if err != nil {
		fmt.Println("Error unmarshaling :", err)
		return
	}
	// fmt.Println("Symptom Checker Result : ", result)
	ctx.IndentedJSON(http.StatusOK, gin.H{"Message": "Data fetched successfully", "data": result, "success": true})
}

// Controller for fetching the latest health metrics of the patient.
func GetLatestHealthMetrics(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	query := ` select id,bp,temp,heart_rate,weight,height,spo2,created_at from health_metrics where p_id=$1 order by created_at desc limit 1 `
	row, err := conn.DB.Query(context.Background(), query, userID)
	if err != nil {
		fmt.Println("Error in fetching latest health metrics : ", err.Error())
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in fetching latest health metrics", "success": false})
		return
	}
	var latestMetrics model.Health_Metrics
	for row.Next() {
		err := row.Scan(&latestMetrics.Id, &latestMetrics.Bp, &latestMetrics.Temp, &latestMetrics.Heart_Rate, &latestMetrics.Weight, &latestMetrics.Height, &latestMetrics.Spo2, &latestMetrics.Created_At)
		if err != nil {
			fmt.Println("Error in scanning latest health metrics : ", err.Error())
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in fetching latest health metrics", "success": false})
			return
		}
	}
	ctx.IndentedJSON(http.StatusOK, gin.H{"Message": "Latest Health Metrics fetched successfully", "success": true, "data": latestMetrics})
}

// /Patch request for updating the profile data of the patient.
func UpdatePatientData(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var profileData model.UpdatePatientData
	err := ctx.ShouldBindJSON(&profileData)
	if err != nil {
		fmt.Println("Error in binding the profile data : ", err.Error())
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"Message": "Invalid input", "success": false})
		return
	}
	query := ` update users set age=$1, gender=$2, phn_no=$3 where id=$4 `
	_, err = conn.DB.Exec(context.Background(), query, profileData.Age, profileData.Gender, profileData.Phn_no, userID)
	if err != nil {
		fmt.Println("Error in updating the profile data : ", err.Error())
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": "Error in updating the profile data", "success": false})
		return
	}
	ctx.IndentedJSON(http.StatusOK, gin.H{"Message": "Profile data updated successfully", "success": true})
}
