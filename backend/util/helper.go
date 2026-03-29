package util

import (
	"context"
	"fmt"
	"log"
	conn "nexcare/backend/config"

	"github.com/gin-gonic/gin"
)

func GetUserDetails(email_id string) (id string, name string, role string) {

	q1 := ` select id,name,role from users where email= $1 `

	err := conn.DB.QueryRow(context.Background(), q1, email_id).Scan(&id, &name, &role)
	if err != nil {
		log.Fatal(err.Error())
	}
	return id, name, role
}

func DeleteRefreshToken(ctx *gin.Context, refresh_token string) {
	query := ` delete from refresh_token where token=$1 `
	_, err := conn.DB.Exec(context.Background(), query, refresh_token)
	if err != nil {
		ctx.IndentedJSON(404, gin.H{"Message": "Refresh Token not deleted!!", "success": false})
		return
	}
}

func GetUserIdFromToken(ctx *gin.Context) (string, error) {
	userId, exists := ctx.Get("userID")
	if !exists {
		return "", fmt.Errorf("userId not found in context")
	}
	return userId.(string), nil
}
