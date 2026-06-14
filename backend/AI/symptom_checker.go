package AI

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	model "nexcare/backend/models"
	"os"
	"strings"
)

func AnalyzeSymptom(userInput string) (string, bool) {

	// This function will take the user input and return the possible symptoms based on the symptoms provided by the user.
	// fmt.Println("Symptom Checker function called with user input: ", userInput)

	apiKey := os.Getenv("GEMINI_API_KEY")
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey
	prompt := `
You are a highly accurate and helpful AI medical assistant for patients.

Analyze the symptoms provided by the user carefully and generate a possible medical assessment.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use triple backticks.
- Do NOT add explanation text outside JSON.
- recommendation must be an ARRAY of strings.
- nextSteps must be an ARRAY of strings.
- confidence must be a number.
- shouldConsult must be boolean.

JSON STRUCTURE:

{
  "assessment": "possible diagnosis based on symptoms",
  "urgency": "low/medium/high",
  "recommendation": [
    "recommendation 1",
    "recommendation 2"
  ],
  "confidence": 75,
  "nextSteps": [
    "next step 1",
    "next step 2"
  ],
  "shouldConsult": true
}

USER SYMPTOMS:
` + userInput

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{
						"text": prompt,
					},
				},
			},
		},
	}

	jsonBytes, err := json.Marshal(requestBody)

	if err != nil {
		fmt.Println("Error marshaling request:", err)
		return "", false
	}
	// send POST request
	resp, err := http.Post(
		url,
		"application/json",
		bytes.NewBuffer(jsonBytes),
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
	log.Println("Raw response from Gemini API:", respText)
	//unmarshal the data.
	var geminiResp model.GeminiResponse
	err = json.Unmarshal([]byte(respText), &geminiResp)
	if err != nil {
		fmt.Println("Error unmarshalling response:", err)
		return "", false
	}
	if len(geminiResp.Candidates) == 0 {
		log.Println(geminiResp)
		fmt.Println("No candidates returned")
		return "", false
	}

	text_ := geminiResp.Candidates[0].Content.Parts[0].Text
	fmt.Println("Response from Gemini API:", text_)
	text := strings.ReplaceAll(text_, "```json", "")
	text = strings.ReplaceAll(text, "```", "")
	cleaned := strings.TrimSpace(text)
	fmt.Println("CLEANED JSON :", cleaned)
	return cleaned, true
}
