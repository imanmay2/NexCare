package model

import (
	"github.com/gorilla/websocket"
)

// stores all the active connections of the users in the system
type Client struct {
	Conn           *websocket.Conn
	Appointment_id string ` json:"a_id" binding:"required" `
	Role           string ` json:"role" binding:"required" `
	User_id        string ` json:"user_id" binding:"required" `
}

// frontend data fetch struct
type JoinMsg struct {
	Appointment_id string ` json:"a_id" binding:"required" `
	Role           string ` json:"role" binding:"required" `
}

// struct for sending for all the clients in the room including the user.
type OutgoingMsg struct {
	Sender_id string `json:"sender_id" binding:"required"`
	Role      string `json:"role" binding:"required"`
	Msg       string `json:"msg" binding:"required"`
}

// Struct useful for Signalling. 
type SignalMsg struct {
	Type string ` json:"type" `
	Msg string ` json:"msg,omitempty" `
	SDP string ` json:"sdp,omitempty" `
	Candidate string ` json:"candidate,omitempty" `
}

// //signalling struct for WebRTC
// type SignalMsg struct{
// 	Type string ` json:"type" `
// 	SDP string ` json:"sdp,omitempty" `
// 	Candidate string ` json:"candidate,omitempty" `
// }