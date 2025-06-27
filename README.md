Equinex – Your Stock Trading Platform
Equinex is a full-stack stock trading simulation platform featuring real-time stock data, a chatbot assistant, portfolio holdings, order history, and private messaging. It’s designed for learning, testing, and exploring stock trading concepts in a clean and modern interface.

Tech Stack
Frontend:

React.js

Axios

React Router

Chart.js

Backend:

Node.js (Express)

WebSocket (native WS + Socket.IO)

MongoDB + Mongoose

Passport.js for auth

JWT for APIs

External APIs: MarketStack, Finnhub, AlphaVantage

Deployment:

Frontend: Vercel

Backend: Render

Quick Setup
1. Clone Repo & Install Dependencies
git clone https://github.com/your-username/equinex-trading-platform.git
cd equinex-trading-platform

# Backend Setup
cd backend
npm install

# Frontend Setup
cd ../frontend
npm install

2. Backend Setup
Create a .env file inside the /backend directory and add the following:

PORT=10000
MONGO_URL=mongodb://localhost:27017/equinex
SECRET=your-secret-key
MARKETSTACK_API_KEY=your_marketstack_api_key
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

Start the backend server:

node combined-server.js

3. Frontend Setup
cd ../frontend
npm install

Create a .env file inside the /frontend directory and add the following:

REACT_APP_BACKEND_URL=http://localhost:10000
REACT_APP_WEBSOCKET_PORT=10000

Start the frontend:

npm start

Now your app runs at http://localhost:3000 and the backend at http://localhost:10000.

Features
User Authentication (Passport + JWT)

Real-Time Stock Prices via WebSocket (Finnhub)

AI Chatbot with Stock Info (AlphaVantage)

Dynamic Holdings & Order History

Virtual Buy/Sell Simulation

Private Messaging (Socket.IO)

REST APIs for user, posts, and orders

Folder Structure
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

License
MIT License © 2025
