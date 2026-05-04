# 🚀 NexCare — The Future of Telemedicine  

> A full-stack telemedicine platform connecting **patients, doctors, and pharmacies** into one seamless ecosystem.

---

## 🌟 Overview  

**NexCare** is not just a simple application — it’s an **all-in-one healthcare platform** where everything happens in one place.  

From **doctor consultations → prescriptions → medicine delivery**, NexCare is designed to simplify and modernize healthcare access.  

💡 Imagine a system where:
- You consult a doctor 💬  
- Get a prescription 🧾  
- And receive medicines at your doorstep 💊  

—all without leaving your home.

---

## 💡 Problem Statement  

Healthcare today is:
- Fragmented ❌  
- Time-consuming ❌  
- Not easily accessible ❌  

👉 NexCare solves this by creating a **unified digital healthcare ecosystem**.

---

## ⚡ Features  

### 👨‍⚕️ Patient  
- 📅 Book doctor appointments  
- 🎥 Video consultation *(planned)*  
- 🎙️ Audio consultation *(planned)*  
- 💬 Real-time chat *(planned)*  
- 🧾 Access prescriptions  
- 💊 Order medicines  

---

### 🩺 Doctor  
- Manage appointments  
- Conduct consultations  
- Generate digital prescriptions  
- Access patient history  

---

### 💊 Pharmacy  
- Receive prescriptions  
- Process medicine orders  
- Deliver medicines to patients  

---

## 🔥 Core Functionalities  

- 📅 Appointment Scheduling  
- 🎥 Video Calling *(Upcoming)*  
- 🎙️ Audio Calling *(Upcoming)*  
- 💬 Real-time Chat *(WebSockets - Upcoming)*  
- 🧾 Digital Prescription System  
- 💊 Pharmacy Integration  
- 🩺 Health Metrics Tracking (BP, etc.)  

---

## 🧠 Tech Stack  

### 🖥️ Frontend  
- React.js  
- TypeScript  
- Axios  
- Tailwind CSS  
- Vite  

---

### ⚙️ Backend  
- GoLang  
- Gin Framework  
- REST APIs  
- Redis (Caching / Session handling)  

---

### 🗄️ Database  
- PostgreSQL (Supabase)  
- JSONB for flexible health data  

---

### 🔗 Real-Time (Upcoming)  
- WebSockets (Gorilla WebSocket)  

---

### ☁️ Tools  
- Git & GitHub  
- Postman  
- Render / Netlify  

---

## 🏗️ Architecture  

```text
                ┌────────────────────┐
                │     Frontend       │
                │   (React + Vite)   │
                └─────────┬──────────┘
                          │ HTTP / WS
                          ▼
                ┌────────────────────┐
                │     Backend        │
                │   (Go + Gin)       │
                ├────────────────────┤
                │ Controllers        │
                │ Services (Planned) │
                │ Middleware         │
                │ Sockets (Future)   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │     Database       │
                │   PostgreSQL       │
                │   (Supabase)       │
                └────────────────────┘
```
📂 Project Structure
🔹 Backend
```
backend/
├── config/
│   ├── db.go
│   └── redis.go
│
├── controllers/
│   ├── doctor.go
│   ├── patient.go
│   └── users.go
│
├── middleware/
│
├── models/
│   ├── DoctorModel.go
│   ├── PatientModel.go
│   └── UserModel.go
│
├── routes/
│
├── tmp/                # temp build files (ignored)
├── util/
│
├── .env
├── .gitignore
├── go.mod
├── go.sum
└── main.go
```

🔹 Frontend
```
client/
├── src/
│   ├── components/
│   ├── guidelines/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── .env
└── .gitignore
```

🧪 Current Status
✅ Core APIs implemented
✅ Database integration complete
✅ Health records system
🔄 Redis integration (in progress)
🔄 Real-time chat (planned)
🔄 Video & audio consultation (planned)
🚀 Getting Started
```
1️⃣ Clone the repository
git clone https://github.com/your-username/nexcare.git
cd nexcare
```
2️⃣ Backend Setup
```
cd backend
go mod tidy
go run main.go
```
3️⃣ Frontend Setup
```
cd client
npm install
npm run dev
```
🔐 Environment Variables
Backend .env
```
PORT=8080
DATABASE_URL=your_db_url
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
```
🧠 Future Improvements
💬 WebSocket-based real-time chat
🎥 Video consultation (WebRTC / APIs)
🔔 Notification system
📊 Health analytics dashboard
🤖 AI-based symptom checker
🤝 Collaboration

This project is built collaboratively:

💻 Backend & System Design: Manmay
🩺 Medical Insights & Product Direction: Soumadeep (MBBS)

👉 Combining technical expertise + real-world medical knowledge to build something impactful.

📢 Final Note

NexCare is not just a project — it’s a step towards building a real-world healthcare solution.

🚀 We’re just getting started.
