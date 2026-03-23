# 🤖 Xhancy AI – MERN Stack AI Chat Application

Xhancy AI is a full-stack AI-powered chat application built using the MERN stack. It allows users to interact with an AI chatbot, get real-time responses, and stay updated with live web-based information.

🔗 **Live Demo:** https://perplexity-ai-1-umbd.onrender.com

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register & Login system
  - Email verification using Nodemailer
  - Secure JWT-based authentication

- 💬 **AI Chat System**
  - Create and manage chat conversations
  - Real-time AI responses
  - Clean and modern chat UI

- 🌐 **Real-Time Web Data**
  - Fetches updated information from the internet
  - Works similar to AI search engines

- 🌓 **Dark / Light Mode**
  - Smooth theme switching

- 📱 **Fully Responsive**
  - Mobile, tablet, and desktop support

- 🗑️ **Chat Management**
  - Delete chat functionality
  - Organized chat history

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Axios
- Tailwind CSS / CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Mongoose)

**Other Tools**
- Nodemailer (Email Verification)
- JWT (Authentication)
- Render (Deployment)

---

## 📂 Project Structure
Xhancy-AI/
│
├── client/ # Frontend (React)
├── server/ # Backend (Node + Express)
├── models/ # Database Models
├── routes/ # API Routes
├── controllers/ # Business Logic
├── middleware/ # Auth Middleware
└── utils/ # Helper Functions



---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/xhancy-ai.git
cd xhancy-ai

## 2. Install dependencies
##Backend:
cd server
npm install
##Frontend:
cd client
npm install

## 3. Environment Variables
Create a .env file in the server folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
