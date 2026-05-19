package util

import (
	"context"
	"fmt"
	"log"
	conn "nexcare/backend/config"
	"strconv"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetUserDetails(email_id string) (id string, name string, role string, isOnboarded bool) { // want the isonboarded to be optional 

	q1 := ` select id,name,role from users where email= $1 `

	err := conn.DB.QueryRow(context.Background(), q1, email_id).Scan(&id, &name, &role)
	if err != nil {
		log.Fatal(err.Error())
	}

	if(role == "doctor"){
		// check if id is present in doctors table
		q2 := ` select d_id from doctor where d_id=$1 `
		err = conn.DB.QueryRow(context.Background(), q2, id).Scan(&id)
		if err == pgx.ErrNoRows {
			log.Printf("Doctor with id %s not found in doctor table", id)
			return id, name, role, false
		}else{
			return id, name, role, true
		}
	}
	return id, name, role, false
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

func Decide_first2Char(role string) string {
	var char_ string
	switch role {
	case "patient":
		char_ = "PX"
	case "doctor":
		char_ = "DR"
	case "pharmacy":
		char_ = "PH"
	}
	str:=time.Now().Format("010206") //MMDDYY
	return str[4:]+char_
}

func Generate_General_Id(ctx *gin.Context, name string, role string) string {
	name = strings.ToUpper(name) //upper case the name to maintain the format of general id
	role = strings.ToLower(role)
	var prev_id string
	query := ` select gen_id from users where role=$1 order by created_at desc limit 1 `
	err := conn.DB.QueryRow(context.Background(), query, role).Scan(&prev_id)
	if err == pgx.ErrNoRows || prev_id == "" {
		fmt.Printf("No previous id.")
		gen_id := fmt.Sprintf("%s0001",Decide_first2Char(role))
		return gen_id
	}
	if err != nil {
		fmt.Printf("Error occured__ : %s", err.Error())
		return "NULL"
	}

	//fetching the digits
	id_ := prev_id[4:]
	num, err := strconv.Atoi(id_)
	if err != nil {
		fmt.Printf("Error in convertion %s", err.Error())
		return "NULL"
	}
	var num_str string
	if num < 9 {
		num_str = fmt.Sprintf("000%d", num+1)
	} else if num < 99 {
		num_str = fmt.Sprintf("00%d", num+1)
	} else if num < 999 {
		num_str = fmt.Sprintf("0%d", num+1)
	} else {
		num_str = fmt.Sprintf("%d", num+1)
	}
	gen_id := fmt.Sprintf("%s%s",Decide_first2Char(role), num_str)
	return gen_id
}