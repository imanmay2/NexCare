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
	userID:=ctx.GetString("userID")
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
		log.Println("Error in unmarshalling the fetched frontend data in sockets",err.Error())
		return
	}

	//create client
	client := &model.Client{
		Conn:           conn,
		Appointment_id: joinMsg.Appointment_id,
		Role:           joinMsg.Role,
		User_id:       userID, //fetching the user id from the context itself.
	}

	//add the client in the room.   room_id will be the appointment_id
	Rooms[joinMsg.Appointment_id] = append(Rooms[joinMsg.Appointment_id], client)
	log.Printf("User %s joined Room : %s", userID, joinMsg.Appointment_id)
	log.Println("Room--->",Rooms)
	

	//for the remaining chat messages.
	for {
		//read the incoming messages coming from the frontend.
		_, data, err = conn.ReadMessage()
		if err != nil {
			log.Println("Error in reading the chat msg in Chat Section:", err)
			break
		}
		//unmarshal into Go Struct
		var incoming model.IncomingMsg
		err = json.Unmarshal(data, &incoming)
		if err != nil {
			log.Println("Error in unmarhsalling the data",err.Error())
			continue
		}

		//now from frontend as the data is fetched so send in the respective rooms.
		clientMsg := model.OutgoingMsg{
			Sender_id: client.User_id,
			Role:      client.Role,
			Msg:       incoming.Msg,
		}

		//send all the clients in the room-->BROADCASTING-->send to frontend
		roomClients := Rooms[client.Appointment_id]
		for _, roomClient := range roomClients {
			err = roomClient.Conn.WriteJSON(clientMsg)
			if err != nil {
				log.Println("Error in writing the chat msg to room clients:", err)
				break
			}
		}
	}

	//when client gets disconnected,, remove the client from the rooms.
	roomClients:=Rooms[client.Appointment_id]
	for i,roomClient:=range roomClients{
		if roomClient==client{
			//remove the client and keep the existing clients only using index value
			Rooms[client.Appointment_id]=append(roomClients[:i],roomClients[i+1:]...)
			log.Printf("User %s has been disconnected",client.User_id)
			break
		}
	}

	///if there exists no clients in the room,  cleanup---> so that unnecssary memory usage won't be there.
	if len(Rooms[client.Appointment_id])==0{
		delete(Rooms, client.Appointment_id)
		log.Printf("Room %s has been removed", client.Appointment_id)
	}
	log.Println("Room--->",Rooms)
}