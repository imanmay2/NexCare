package util

import (
	"context"
	"log"
	conn "nexcare/backend/config"
)

func GetUserDetails(email_id string) (string,string,string){
	
	q1:=` select id,name,role from users where email= $1 `

	var id string
	var name string
	var role string

	err:=conn.DB.QueryRow(context.Background(),q1,email_id).Scan(&id,&name,&role)
	if err!=nil{
		log.Fatal(err.Error())
	}
	return id,name,role
}