package controllers
import (
	// "fmt"
	"github.com/gorilla/websocket"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

//converts the http request into socket connections which will be alive
var upgrader=websocket.Upgrader{
	CheckOrigin:func(r *http.Request) bool{
		return true
	},
}


// demo function to cehck if the websocket connection is working or not
func WebSocketHandler(ctx *gin.Context){
	conn,err:=upgrader.Upgrade(ctx.Writer,ctx.Request,nil)
	if err!=nil{
		ctx.JSON(500,gin.H{"error":"Failed to upgrade to WebSocket"})
		return
	}
	log.Println("WebSocket connection established")
	for{
		_,msg,err:=conn.ReadMessage()
		if err!=nil{
			log.Println("Error reading message:", err)
			break
		}
		log.Println("====>Message",string(msg))
	}
	defer conn.Close()
}