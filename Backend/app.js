const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const { connectToSocket } = require("./controllers/socketManager"); // If this exists
const userRoutes = require("./routes/users.routes"); // Route file

const app = express();
const server = createServer(app);

// Optional socket setup, if you use it
const io = connectToSocket(server); // Comment this if connectToSocket doesn't exist

// Middleware
app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// API Routes
app.use("/api/v1/users", userRoutes);

// MongoDB + Server Start
const start = async () => {
  try {
    const connectionDb = await mongoose.connect("mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server running on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

start();
