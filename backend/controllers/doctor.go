package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	conn "nexcare/backend/config"
	"nexcare/backend/models"
	"nexcare/backend/util"

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
	// Update the profile data and professional data of the doctor
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
	ctx.IndentedJSON(200, gin.H{"Message": "Doctor Info Updated Successfully", "success": true})
}

func GetAppointments() {
	// Get the list of appointments for the doctor

}

func GetPatientRecords() {
	// Get the medical records of the selected patient

}
