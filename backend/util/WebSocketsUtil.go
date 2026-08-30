package util

import (
	// "github.com/gorilla/websocket"
	"log"
	model "nexcare/backend/models"
)

// function to send the message to all the clients in the room.
func SignalParticipants(baseMsg model.SignalMsg,RoomClients []*model.Client, sender_id string){
	for _, client := range RoomClients {
		if client.User_id != sender_id {
			log.Printf(" Message Type : %s",baseMsg.Type)
			err := client.Conn.WriteJSON(baseMsg)
			if err != nil {
				client.Conn.Close()
			}
		}
	}
}

//function to remove client from rooms.
func RemoveClients(Rooms map[string][]*model.Client, client *model.Client) {
	for i,roomClient:=range Rooms[client.Appointment_id]{
		if(roomClient==client){
			Rooms[client.Appointment_id] = append(Rooms[client.Appointment_id][:i], Rooms[client.Appointment_id][i+1:]...)
			log.Printf("User %s has been disconnected", client.User_id)
			break
		}
	}
}

//if there is no room left then remove the room from the map.
func RemoveRoom(Rooms map[string][]*model.Client,client *model.Client){
	if(len(Rooms[client.Appointment_id])==0){
		log.Printf("Room %s has been deleted",client.Appointment_id)
		delete(Rooms,client.Appointment_id)
		log.Print("Rooms available are : ",Rooms)
	}
}