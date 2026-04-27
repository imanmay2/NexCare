# 🚀 NexCare — The Future of Telemedicine

> A full-stack telemedicine platform connecting **patients, doctors, and pharmacies** into one seamless ecosystem.

---

## 🌟 Overview

**NexCare** is not just a simple application — it’s an **all-in-one healthcare platform** where everything happens in one place.

From **doctor consultations → prescriptions → medicine delivery**, NexCare aims to simplify and modernize healthcare access.

---

## 💡 Problem Statement

Healthcare today is:
- Fragmented ❌  
- Time-consuming ❌  
- Not easily accessible ❌  

👉 NexCare solves this by providing a **unified digital healthcare ecosystem**.

---

## ⚡ Features

### 👨‍⚕️ Patient Features
- 📅 Book appointments with doctors  
- 🎥 Video consultations *(planned)*  
- 🎙️ Audio consultations *(planned)*  
- 💬 Real-time chat *(planned)*  
- 🧾 View prescriptions  
- 💊 Order medicines  

---

### 🩺 Doctor Features
- Manage appointments  
- Conduct consultations  
- Generate digital prescriptions  
- Access patient records  

---

### 💊 Pharmacy Features
- Receive prescriptions  
- Fulfill medicine orders  
- Deliver medicines to patients  

---

## 🔥 Core Functionalities

- 📅 Appointment Scheduling System  
- 🎥 Video Calling (Upcoming)  
- 🎙️ Audio Calls (Upcoming)  
- 💬 Real-time Chat (WebSockets - Upcoming)  
- 🧾 Digital Prescription System  
- 💊 Pharmacy Integration  
- 🩺 Health Metrics Tracking (BP, etc.)  

---

## 🧠 Tech Stack

### 🖥️ Frontend
- React.js  
- Axios  
- Tailwind CSS  

---

### ⚙️ Backend
- GoLang  
- Gin Framework  
- REST APIs  

---

### 🗄️ Database
- PostgreSQL (Supabase)  
- JSONB for flexible data storage  

---

### 🔗 Real-time (Planned)
- WebSockets (Gorilla WebSocket)  

---

### ☁️ Tools
- Git & GitHub  
- Postman  
- Render / Netlify  

---

## 🏗️ Architecture


                ┌────────────────────┐
                │     Frontend       │
                │     (React)        │
                └─────────┬──────────┘
                          │ HTTP / WS
                          ▼
                ┌────────────────────┐
                │     Backend        │
                │   (Go + Gin)       │
                ├────────────────────┤
                │ Controllers        │
                │ Services           │
                │ Sockets (Future)   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │     Database       │
                │   PostgreSQL       │
                │   (Supabase)       │
                └────────────────────┘
📂 Project Structure
backend/
├── cmd/
│   ├── server/
│   └── scripts/
├── controllers/
├── services/
├── models/
├── routes/
├── middleware/
├── sockets/        # future real-time support
├── repository/
├── config/

client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── sockets/
🧪 Current Status
✅ Core APIs implemented
✅ Database integration complete
✅ Health records system
🔄 Real-time chat (in progress)
🔄 Video & audio consultation (planned)
🚀 Getting Started
1️⃣ Clone the repo
git clone https://github.com/your-username/nexcare.git
cd nexcare
2️⃣ Backend Setup
cd backend
go mod tidy
go run cmd/server/main.go
3️⃣ Frontend Setup
cd client
npm install
npm run dev
🔐 Environment Variables

Create .env files in both frontend & backend:

Backend
PORT=8080
DATABASE_URL=your_db_url
JWT_SECRET=your_secret
🧠 Future Improvements
✅ WebSocket-based real-time chat
🎥 Video consultation (WebRTC / API integration)
🔔 Notifications system
📊 Health analytics dashboard
🧠 AI-based symptom checker
🤝 Collaboration

This project is built collaboratively:

💻 Backend & System Design: Manmay
🩺 Medical Insights & Product Direction: Soumadeep (MBBS)

👉 Combining technical + medical expertise to build a real-world solution.

📢 Final Note

NexCare is not just a project — it’s a step towards building a real, impactful healthcare solution.

🚀 More features coming soon. Stay tuned!
