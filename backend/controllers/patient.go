package controllers

import (
	"context"
	"log"
	conn "nexcare/backend/config"
	"nexcare/backend/model"

	"github.com/gin-gonic/gin"
)

func GetPatientInfo(ctx *gin.Context){
	ctx.IndentedJSON(200,gin.H{"Message":"Welcome Mr. ","Success":true})
}

func GetDoctorInfo(ctx *gin.Context){
	q1:=` select  u.name,d.consultation_fee,d.rating,d.languages,d.experience,d.domain from users u inner join doctor d on u.id=d.d_id `
	var doctorData []model.DoctorInfo
	rows,err:=conn.DB.Query(context.Background(),q1);if err!=nil{
		ctx.IndentedJSON(500,gin.H{"Message":err.Error(),"success":false})
		return;
	}
	
	for rows.Next(){
		var doc model.DoctorInfo
		rows.Scan(&doc.Name,&doc.Fee,&doc.Rating,&doc.Languages,&doc.Experience,&doc.Domain)
		doctorData=append(doctorData, doc)
	}

	log.Print(doctorData)
	ctx.IndentedJSON(200,gin.H{"Message":"Doctor Data fetched successfully","success":true,"data":doctorData})
}