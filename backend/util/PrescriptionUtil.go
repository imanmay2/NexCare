package util

import (
	"context"
	"log"
	"net/http"
	conn "nexcare/backend/config"
	model "nexcare/backend/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func InsertPrescription(ctx *gin.Context, prescription model.Prescription) {
	query := `insert into consultation (id,created_at,a_id,title,symptoms,diagnosis,treatment,physical_examination,drug,investigations,summary,follow_up_date,status,finalized_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) `
	_, err := conn.DB.Exec(context.Background(), query, uuid.NewString(), time.Now(), prescription.A_id, prescription.Title, prescription.Symptoms, prescription.Diagnosis, prescription.Treatment, prescription.Physical_Examination, prescription.Drug, prescription.Investigation, prescription.Summary, prescription.Follow_Up_Date, prescription.Status, prescription.Finalized_At)
	if err != nil {
		log.Println("Error inserting prescription:", err)
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(http.StatusCreated, gin.H{"Message": "Prescription saved successfully", "success": true})
}

func UpdatePrescription(ctx *gin.Context, prescription model.Prescription, id string) {
	update_query := ` update consultation set title=$1,symptoms=$2,diagnosis=$3,treatment=$4,physical_examination=$5,drug=$6,investigations=$7,summary=$8,follow_up_date=$9,status=$10,finalized_at=$11 where id=$12 `
	_, err := conn.DB.Exec(context.Background(), update_query, prescription.Title, prescription.Symptoms, prescription.Diagnosis, prescription.Treatment, prescription.Physical_Examination, prescription.Drug, prescription.Investigation, prescription.Summary, prescription.Follow_Up_Date, prescription.Status, prescription.Finalized_At, id)
	if err != nil {
		log.Println("Error updating prescription:", err)
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"Message": err.Error(), "success": false})
		return
	}
	ctx.IndentedJSON(http.StatusOK, gin.H{"Message": "Prescription saved successfully", "success": true})
}
