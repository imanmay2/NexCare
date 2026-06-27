package controllers

import (
	// "fmt"
	"encoding/json"
	"log"
	"net/http"
	model "nexcare/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// converts the http request into socket connections which will be alive
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var Rooms = make(map[string][]*model.Client)

// socket handler functions.
func WebSocketHandler(ctx *gin.Context) {
	//socket connection
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Fatalf("Couldnot connect to the Socket. ")
		return
	}
	defer conn.Close()
	log.Println("WebSocket connection established")
	//read the first message send from frontend to create client and rooms.

	_, data, err := conn.ReadMessage()
	if err != nil {
		log.Println("Error in Reading the first Message from frontend")
		return
	}

	var joinMsg model.JoinMsg
	//unmarshal the data to Go Struct
	err = json.Unmarshal(data, &joinMsg)
	if err != nil {
		log.Println("Error in unmarshalling the fetched frontend data in sockets")
		return
	}

	//create client
	client := &model.Client{
		Conn:           conn,
		Appointment_id: joinMsg.Appointment_id,
		Role:           joinMsg.Role,
		User_id:        ctx.GetString("userID"), //fetching the user id from the context itself.
	}

	//add the client in the room.   room_id will be the appointment_id
	Rooms[joinMsg.Appointment_id] = append(Rooms[joinMsg.Appointment_id], client)
	log.Printf("User %s joined Room : %s",ctx.GetString("userID"),joinMsg.Appointment_id)

	//for the remaining chat messages. 
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		log.Println("====>Message", string(msg))
	}
}