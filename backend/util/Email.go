package util

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

func SendEmail(to string, otp string) error {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error in loading the env's")
		return err
	}

	m := gomail.NewMessage()
	m.SetHeader("From", "code.rx.official.channel@gmail.com")
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Your OTP for NexCare authentication")
	m.SetBody("text/html", "Your OTP for NexCare Authentication is: "+otp)

	d := gomail.NewDialer("smtp.google.com", 587, "code.rx.official.channel@gmail.com", os.Getenv("GOOGLE_SMTP_APP_PASSWORD"))

	if err := d.DialAndSend(m); err != nil {
		return err
	}
	return nil
}
