package model
import (
	"github.com/gorilla/websocket"
)

//stores all the active connections of the users in the system
type Client struct{
	Conn *websocket.Conn
	A_id string ` json:"a_id" binding:"required" `
	Role string ` json:"role" binding:"required" `
	User_id string ` json:"user_id" binding:"required" `
}

