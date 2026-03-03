package controllers

import (
	"context"
	conn "nexcare/backend/config"
	"nexcare/backend/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	q1 := " select a.id,u.name,a.date,a.time,a.consultation_type,a.status,a.symptoms from users u inner join appointment a on u.id=a.d_id where u.role=$1 and p_id=$2"
	rows, err := conn.DB.Query(context.Background(), q1, "doctor", userID)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": "Error in fetching upcoming appointment", "success": false})
		return
	}

	var appointmentData []model.Appointment
	for rows.Next() {
		//upcoming.
		var appointment model.Appointment
		rows.Scan(&appointment.Id, &appointment.DoctorName, &appointment.Date, &appointment.Time, &appointment.Type, &appointment.Status, &appointment.Symptom)
		appointmentData = append(appointmentData, appointment)
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Data fetched successfully", "success": true, "data": appointmentData})
}

func PostAppointment(ctx *gin.Context) {
	//post request for feeding the appointment details into the database
	var appointmentDetails model.Appointment
	err := ctx.ShouldBindJSON(&appointmentDetails)
	if err != nil {
		ctx.IndentedJSON(500, gin.H{"Message": err.Error(), "success": false})
		return
	}
	//push the data in the appointment table.
	p_id:=ctx.GetString("userID")
	q2:=" insert into appointment values($1,$2,$3,$4,$5,$6,$7)"
	_,err=conn.DB.Exec(context.Background(),q2,uuid.NewString(),p_id,appointmentDetails.D_id,appointmentDetails.Date,appointmentDetails.Time,appointmentDetails.Status,appointmentDetails.Type,appointmentDetails.Symptom)
	if err!=nil{
		ctx.IndentedJSON(500,gin.H{"Message":"Could insert data in the appointment table","success":true})
		return
	}
	ctx.IndentedJSON(200, gin.H{"Message": "Appointment Booked Successfully", "success": true})
}
