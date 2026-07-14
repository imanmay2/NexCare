package controllers

import (
	"context"
	conn "nexcare/backend/config"

	"github.com/gin-gonic/gin"
)

func GetMedicines(ctx *gin.Context) {

	query := `
		SELECT 
			id,
			name,
			generic_name,
			manufacturer,
			strength,
			dosage_form,
			category,
			is_otc
		FROM medicines
		ORDER BY name ASC
	`

	rows, err := conn.DB.Query(context.Background(), query)

	if err != nil {
		ctx.IndentedJSON(500, gin.H{
			"Message": err.Error(),
			"success": false,
		})
		return
	}

	defer rows.Close()

	var medicines []map[string]interface{}

	for rows.Next() {

		var (
			id           string
			name         string
			genericName  string
			manufacturer string
			strength     string
			dosageForm   string
			category     string
			isOTC        bool
		)

		err := rows.Scan(
			&id,
			&name,
			&genericName,
			&manufacturer,
			&strength,
			&dosageForm,
			&category,
			&isOTC,
		)

		if err != nil {
			ctx.IndentedJSON(500, gin.H{
				"Message": err.Error(),
				"success": false,
			})
			return
		}

		medicine := map[string]interface{}{
			"id":           id,
			"name":         name,
			"generic_name": genericName,
			"manufacturer": manufacturer,
			"strength":     strength,
			"dosage_form":  dosageForm,
			"category":     category,
			"is_otc":       isOTC,
		}

		medicines = append(medicines, medicine)
	}

	ctx.IndentedJSON(200, gin.H{
		"medicines": medicines,
		"Message":   "Medicines Retrieved Successfully",
		"success":   true,
	})
}
