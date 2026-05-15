package util

import (
	"context"
	"fmt"
	"log"
	conn "nexcare/backend/config"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
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


func Generate_General_Id(ctx *gin.Context,name string) string{
	name=strings.ToUpper(name) ///upper case the name to maintain the format of general id
	var prev_id string
	query:=` select gen_id from users order by created_at desc limit 1 `
	err:=conn.DB.QueryRow(context.Background(),query,).Scan(&prev_id)
	if(err==pgx.ErrNoRows){
		fmt.Printf("No previous id.")
		gen_id:=fmt.Sprintf("PX001%s%s",string(name[0]),string(name[1]))
		return gen_id
	}
	if(err!=nil){
		fmt.Printf("Error occured : %s",err.Error())
		return ""
	}

	//fetching the digits
	id_:= prev_id[2:6]
	num,err:=strconv.Atoi(id_)
	if(err!=nil){
		fmt.Printf("Error in convertion %s",err.Error())
		return ""
	}
	gen_id:=fmt.Sprintf("PX%d%s%s",num+1,string(name[0]),string(name[1]))
	return gen_id
}