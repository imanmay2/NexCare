package model

type RequestOrder struct {
	Amount int `json:"amount"`
}

type VerifyPaymentRequest struct {
	OrderID string `json:"razorpay_order_id"`
	PaymentID string `json:"razorpay_payment_id"`
	Signature string `json:"razorpay_signature"`
}