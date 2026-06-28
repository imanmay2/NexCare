package controllers

import (
	"context"
	"log"
	"nexcare/backend/models"
	conn "nexcare/backend/config"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"os"
)

func CreateOrder(ctx *gin.Context){
	client:=conn.ConnectRazorPay()
	var requestOrder model.RequestOrder
	if err := ctx.ShouldBindJSON(&requestOrder); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	
	data := map[string]interface{}{
		"amount": requestOrder.Amount * 100,
		"currency": "INR",
		"receipt": uuid.NewString(),
	}

	order,err:=client.Order.Create(data,nil)
	if err!=nil{
		log.Println("Error creating order:", err.Error())
		ctx.JSON(500, gin.H{"Msg": "Failed to create order", "success": false})
		return
	}
	ctx.JSON(200, gin.H{"Msg": "Order created successfully", "data": order,"success": true})
}


func VerifyPayment(ctx *gin.Context){
	var verifyRequest model.VerifyPaymentRequest
	err:=ctx.BindJSON(&verifyRequest)
	if err!=nil{
		ctx.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	secret:=os.Getenv("TEST_API_SECRET")
	body :=verifyRequest.OrderID + "|" + verifyRequest.PaymentID
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(body))
	expectedSignature :=hex.EncodeToString(h.Sum(nil))
	if expectedSignature != verifyRequest.Signature {
		ctx.JSON(400, gin.H{"success": false,"msg": "Payment verification failed"})
		return
	}

	//insert the payment details in the database if the payment is successful.
	_,err=conn.DB.Exec(context.Background(), "insert into payment (payment_id, order_id, signature) values ($1,$2,$3)", verifyRequest.PaymentID, verifyRequest.OrderID, verifyRequest.Signature)
	if err!=nil{
		log.Println("Error inserting payment details:", err.Error())
		ctx.JSON(500, gin.H{"success": false,"msg": "Failed to store payment details"})
		return
	}
	ctx.JSON(200, gin.H{"success": true,"Msg": "Payment verified successfully","payment_id": verifyRequest.PaymentID})
}