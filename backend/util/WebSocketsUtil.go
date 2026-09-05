package util

import (
	// "github.com/gorilla/websocket"
	"log"
	model "nexcare/backend/models"
	"encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
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



//fetch the twilio token from the twilio server using the twilio api key and secret.





func GetTwilioICEServers() (*model.TwilioTokenResponse, error) {
    accountSID := os.Getenv("ACC_SID")
    authToken := os.Getenv("AUTH_TOKEN")

    if accountSID == "" || authToken == "" {
        return nil, fmt.Errorf("Twilio credentials are missing")
    }

    url := fmt.Sprintf(
        "https://api.twilio.com/2010-04-01/Accounts/%s/Tokens.json",
        accountSID,
    )

    req, err := http.NewRequest(
        http.MethodPost,
        url,
        nil,
    )
    if err != nil {
        return nil, err
    }
    // Equivalent to:
    // curl -u "ACCOUNT_SID:AUTH_TOKEN"
    req.SetBasicAuth(accountSID, authToken)
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }
    if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf(
            "Twilio returned status %d: %s",
            resp.StatusCode,
            string(body),
        )
    }

    var tokenResponse model.TwilioTokenResponse
	//Unmarshal the response body into the TwilioTokenResponse Go struct
    err = json.Unmarshal(body, &tokenResponse)
    if err != nil {
        return nil, err
    }
    log.Printf("Twilio : %s",tokenResponse.ICEServers)
    return &tokenResponse, nil
}