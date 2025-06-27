# 📈 Equinex – Your Stock Trading Platform

**Equinex** is a full-stack stock trading simulation platform that enables users to explore stock trading concepts in a real-time, interactive environment. Designed for learning and experimentation, Equinex provides live market data, AI chatbot support, portfolio tracking, and private messaging.

---

## 🔧 Tech Stack

### Frontend
- **React.js**
- **Axios**
- **React Router**
- **Chart.js**

### Backend
- **Node.js (Express)**
- **WebSocket** (native `ws` + `Socket.IO`)
- **MongoDB** with **Mongoose**
- **Passport.js** (authentication)
- **JWT** (API security)

### APIs Used
- [MarketStack](https://marketstack.com/)
- [Finnhub](https://finnhub.io/)
- [AlphaVantage](https://www.alphavantage.co/)

### Deployment
- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)

---

## 🚀 Features

- ✅ User Authentication (Passport + JWT)
- 📈 Real-Time Stock Prices (via WebSocket + Finnhub)
- 🤖 AI Chatbot with Stock Info (AlphaVantage)
- 💼 Portfolio Holdings & Dynamic Order History
- 🛒 Virtual Buy/Sell Simulation
- 📩 Private Messaging (Socket.IO)
- 📡 REST APIs for Users, Orders, and Posts

---

## ⚙️ Quick Setup

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/your-username/equinex-trading-platform.git
cd equinex-trading-platform

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install


```
#.env
```bash
PORT=10000
MONGO_URL=mongodb://localhost:27017/equinex
SECRET=your-secret-key
MARKETSTACK_API_KEY=your_marketstack_api_key
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```
#Start the backend:

```bash
node combined-server.js
```
### Frontend Configuration
Create a .env file in /frontend directory:


###Start the frontend:

```bash
npm start
Frontend runs at: http://localhost:3000
Backend runs at: http://localhost:10000
```
###📁 Folder Structure
```bash

equinex-trading-platform/
├── backend/
│   ├── combined-server.js
│   ├── routes/
│   ├── model/
│   ├── controllers/
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env
└── README.md
```
