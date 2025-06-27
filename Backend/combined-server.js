// combined-server.js

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import axios from 'axios';

// Import models & routes
import userWebRouter from './routes/user.js'; // traditional form-based
import userApiRouter from './routes/user.routes.js'; // your API-style
import postRoutes from './routes/PostRoutes.js';
import User from './model/user1.js';
import { HoldingsModel } from "./model/HoldingsModel.js";
import { PositionsModel } from "./model/PositionsModel.js";
import { OrdersModel } from "./model/OrdersModel.js";

dotenv.config();

// Setup
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ["https://equinex-your-stock-trading-platform.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// For __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware

app.use(cors({
  origin: ["https://equinex-your-stock-trading-platform.vercel.app", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Session
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600
});
app.use(session({
  store,
  secret: process.env.SECRET || 'mysupersecretstring',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", err => console.error("MongoDB error:", err));

// Web form-based routes
app.use("/", userWebRouter);

// API routes (for React frontend)
app.use("/api/v1/users", userApiRouter);

// Sample session/flash
app.get("/hello", (req, res) => {
  res.json({ name: req.session.name, msg: req.flash("success") });
});
app.get("/demouser", async (req, res) => {
  let fuser = new User({ email: "suna@gmail.ocm", username: "sunax" });
  let regUser = await User.register(fuser, "helloworld");
  res.send(regUser);
});

// Orders
app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();
    res.send("Order saved!");
  } catch (error) {
    res.status(500).send("Error saving order.");
  }
});
app.get("/allHoldings", async (_, res) => {
  try {
    const holdings = await HoldingsModel.find({});
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/allPositions", async (_, res) => {
  try {
    const positions = await PositionsModel.find({});
    res.json(positions);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// News API
app.get('/api/news', async (_, res) => {
  try {
    const response = await axios.get('http://api.marketstack.com/v1/eod', {
      params: {
        access_key: process.env.MARKETSTACK_API_KEY,
        symbols: 'AAPL,MSFT,TSLA,GOOGL,AMZN,NVDA',
        limit: 6
      }
    });
    const latestData = response.data.data.reduce((acc, item) => {
      if (!acc[item.symbol] || new Date(item.date) > new Date(acc[item.symbol].date)) {
        acc[item.symbol] = item;
      }
      return acc;
    }, {});
    const formattedNews = Object.values(latestData).map(item => ({
      symbol: item.symbol,
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
    res.json(formattedNews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock news' });
  }
});

// Chatbot
app.post('/chatbot', async (req, res) => {
  const stockSymbol = req.body.message?.split(" ").pop()?.toUpperCase();
  if (!stockSymbol) return res.status(400).json({ reply: "No message provided." });

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: stockSymbol,
        interval: '5min',
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      }
    });
    const data = response.data;
    if (data["Time Series (5min)"]) {
      const latestKey = Object.keys(data["Time Series (5min)"])[0];
      const latestData = data["Time Series (5min)"][latestKey];
      res.json({ reply: `The latest price for ${stockSymbol} is ₹${latestData["1. open"]}.` });
    } else {
      res.json({ reply: "Symbol not found or API limit reached." });
    }
  } catch (err) {
    res.json({ reply: "Error fetching stock data." });
  }
});

app.use(express.static(path.join(__dirname, '../frontend')));

// =================== WebSocket (native WS) for real-time stocks ===================
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('WS client connected');

  const fetchStockData = async (symbol) => {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
      const res = await fetch(url);
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  };

  const interval = setInterval(async () => {
    const stocks = ['AAPL', 'GOOGL', 'MSFT'];
    const stockData = await Promise.all(stocks.map(fetchStockData));
    const formatted = stockData.map((d, i) => d && {
      name: stocks[i],
      price: d.c,
      percent: `${((d.c - d.pc) / d.pc * 100).toFixed(2)}%`,
      isDown: d.c < d.pc
    }).filter(Boolean);

    ws.readyState === ws.OPEN && ws.send(JSON.stringify(formatted));
  }, 3000);

  ws.on('close', () => clearInterval(interval));
});

// =================== Socket.IO for private messaging ===================
const users = new Map();
io.on("connection", (socket) => {
  console.log("Socket.IO user connected:", socket.id);

  socket.on("set_username", (username) => {
    users.set(socket.id, username);
    io.emit("user_list", Array.from(users.values()));
  });

  socket.on("send_message", (msg) => {
    const recipientSocketId = [...users].find(([id, name]) => name === msg.to)?.[0];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", msg);
    }
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("user_list", Array.from(users.values()));
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ App + WebSocket + Chat running on port ${PORT}`);
});
