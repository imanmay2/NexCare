package AI

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
)

func AnalyzeSymptom(userInput string) (string, bool) {
	// This function will take the user input and return the possible symptoms based on the symptoms provided by the user.
	fmt.Println("Symptom Checker function called with user input: ", userInput)

	apiKey := os.Getenv("GEMINI_API_KEY")
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey
	prompt := "This is the userInput " + userInput + "\nYou are a helpful and precise medical assistant for patients. Your task is to analyze the symptoms provided by the user and provide a possible diagnosis, urgency level, recommendation, confidence level, next steps, and whether the user should consult a doctor. Please provide the response in JSON format with the following structure: { 'assessment': 'possible diagnosis based on symptoms', 'urgency': 'low/medium/high', 'recommendation': 'suggested actions for the user', 'confidence': confidence level in percentage, 'next_steps': 'suggested next steps for the user', 'should_consult': true/false }"
	// JSON body
	jsonData := `{
		"contents": [{
			"parts": [{
				"text": "` + prompt + `"
			}]
		}]
	}`

	// send POST request
	resp, err := http.Post(
		url,
		"application/json",
		bytes.NewBuffer([]byte(jsonData)),
	)

	if err != nil {
		fmt.Println("Error:", err)
		return "", false
	}
	defer resp.Body.Close()

	// read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading:", err)
		return "", false
	}

	// print response
	respText := string(body)
	fmt.Println("Response from Gemini API:", respText)
	
	text := strings.ReplaceAll(respText, "```", "")
	text1 := strings.ReplaceAll(text, "```json", "")
	text2 := strings.ReplaceAll(text1, "\n", "")
	text3 := strings.ReplaceAll(text2, "\"", "")
	return text3, true
}
