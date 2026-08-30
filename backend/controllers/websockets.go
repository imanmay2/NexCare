package controllers

import (
	// "fmt"
	"encoding/json"
	"log"
	"net/http"
	model "nexcare/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	util "nexcare/backend/util"
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
	userID := ctx.GetString("userID")
	//socket connection
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println("Couldnot connect to the Socket. ")
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
		log.Println("Error in unmarshalling the fetched frontend data in sockets", err.Error())
		return
	}

	//create client
	client := &model.Client{
		Conn:           conn,
		Appointment_id: joinMsg.Appointment_id,
		Role:           joinMsg.Role,
		User_id:        userID, //fetching the user id from the context itself.
	}

	//add the client in the room.   room_id will be the appointment_id
	Rooms[joinMsg.Appointment_id] = append(Rooms[joinMsg.Appointment_id], client)
	log.Printf("User %s joined Room : %s", userID, joinMsg.Appointment_id)
	log.Println("Room--->", Rooms)

	//notify the other person (if present) in the room that peer has joined the room.  --> send to frontend
	peerJoinedMsg := model.SignalMsg{
		Type: "peer-joined",
		Msg:  "Peer has joined the room",
	}
	//marshal the data into JSON format
	peerJoinedData, err := json.Marshal(peerJoinedMsg)
	if err != nil {
		log.Println("Error in marshalling the peer-joined message")
		return
	}
	for _, client = range Rooms[joinMsg.Appointment_id] {
		if client.User_id != userID {
			err = client.Conn.WriteMessage(websocket.TextMessage, peerJoinedData)
			if err != nil {
				log.Println("Error occured in sending peer-msg")
				break
			}
		}
	}


	//for the future signalling.
	for {
		_, data, err = conn.ReadMessage()
		if err != nil {
			log.Println("Error in reading the message", err)
			break
		}
		//unmarshal into Go Struct
		var baseMsg model.SignalMsg
		err = json.Unmarshal(data, &baseMsg)
		if err != nil {
			log.Println("Error in unmarhsalling the data", err.Error())
			continue
		}

		//using switch case to handle the different types of messages coming from the frontend.
		switch baseMsg.Type {
		case "chat":
			//send the chat message to all the clients in the room.
			//now from frontend as the data is fetched so send in the respective rooms.
			clientMsg := model.OutgoingMsg{
				Sender_id: client.User_id,
				Role:      client.Role,
				Msg:       baseMsg.Msg,
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

		case "sdp_offer", "sdp_answer":
			//signal the SDP Offer , answer to the other peer in the room.
			util.SignalParticipants(baseMsg, Rooms[client.Appointment_id], client.User_id)
			break
		

	case "ice-candidate":
			//signal the ICE candidate to the other peer in the room.
			util.SignalParticipants(baseMsg, Rooms[client.Appointment_id], client.User_id)
			
		default:
			log.Println("Unknown message type received:", baseMsg.Type)
		}
	}
	//when client gets disconnected, remove the client from the rooms.
	util.RemoveClients(Rooms, client)

	///if there exists no clients in the room,  cleanup---> so that unnecssary memory usage won't be there.
	util.RemoveRoom(Rooms, client)
}