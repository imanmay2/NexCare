package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	conn "nexcare/backend/config"
	"nexcare/backend/models"
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
		rows.Scan(&appointment.Id, &appointment.D_id,  &appointment.Date,&appointment.DoctorName,&appointment.Status, &appointment.Symptom, &appointment.Time, &appointment.Type)
		appointmentData = append(appointmentData, appointment)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Data fetched successfully", "success": true, "data": appointmentData})
}

func PostAppointment(ctx *gin.Context) {
	fmt.Println("check ck 0")
	//post request for feeding the appointment details into the database
	var appointmentDetails model.Appointment
	err := ctx.ShouldBindJSON(&appointmentDetails)
	// fmt.Println("check ck 1")
	if err != nil {
		// fmt.Println("check ck 2")
		ctx.IndentedJSON(500, gin.H{"Message": "err.Error()", "success": false})
		return
	}
	//push the data in the appointment table.
	p_id := ctx.GetString("userID")
	q2 := `insert into appointment values($1,$2,$3,$4,$5,$6,$7,$8)`
	fmt.Println("check ck 3")
	_, err = conn.DB.Exec(context.Background(), q2, uuid.NewString(), p_id, appointmentDetails.D_id, appointmentDetails.Date, appointmentDetails.Time, appointmentDetails.Status, appointmentDetails.Type, appointmentDetails.Symptom)
	if err != nil {
		fmt.Println("check ck 4")
		ctx.IndentedJSON(500, gin.H{"Message": "Could insert data in the appointment table", "success": false})
		return
	}
	fmt.Println("check ck 5")
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
	q1 := ` select id,created_at,blood_type,allergies,insurance,contacts,family_history,surgical_history,current_medications,medical_conditions,menstrual_history,imp from health_summary where p_id=$1 `
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
		rows.Scan(&summ.Id, &summ.Created_At, &summ.Blood_Type, &summ.Allergies, &summ.Insurance, &contactData, &summ.Family_History, &summ.Surgical_History, &summ.Current_Medication, &summ.Medical_Conditions, &menstrualData, &summ.Imp)
		if contactData != nil {
			err := json.Unmarshal(contactData, &summ.Contact)
			if err != nil {
				fmt.Println("Error occured at Contact unmarshal : ", err.Error())
				return;
			}
		}
		if menstrualData != nil {
			err := json.Unmarshal(menstrualData, &summ.Menstrual_History)
			if err != nil {
				fmt.Println("Error occured in menstrual unmarshal : ", err.Error())
				return;
			}
		}
		summary = append(summary, summ)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Health Summary", "success": true, "data": summary})
}

func GetConsultationData(ctx *gin.Context) {
	fmt.Println("Welcome to Consultation Data")
	userID := ctx.GetString("userID")
	q1 := ` select c.id,c.created_at,c.title,c.symptoms,c.diagnosis,c.treatment,c.physical_examination,c.drug,c.investigations from consultation c inner join appointment a on a.id=c.a_id where a.p_id= $1 `
	rows, err := conn.DB.Query(context.Background(), q1, userID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	var consultData []model.Consultation
	var drugData []byte
	for rows.Next() {
		var data model.Consultation
		err := rows.Scan(&data.Id, &data.Created_At, &data.Title, &data.Symptoms, &data.Diagnosis, &data.Treatment, &data.Physical_examination, &drugData, &data.Investigations)
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