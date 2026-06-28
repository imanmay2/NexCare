package config

import (
	"github.com/razorpay/razorpay-go"
	"os"
)

func ConnectRazorPay() *razorpay.Client {
	key := os.Getenv("TEST_API_KEY")
	secret := os.Getenv("TEST_API_SECRET")
	client := razorpay.NewClient(key, secret)
	return client
}