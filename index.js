import express from "express";
import mongoose from "mongoose";
import User from "./model/user.js";
import dotenv from "dotenv";

// logs
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
const connectDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected successfully");
};

// create log dir
const logDir = "/app/logs";
const logfile = path.join(logDir, "request.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFileSync(logfile, logMessage);
  next();
});

// POST: Store user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  console.log("Request received at /");
  res.send("Welcome to the User API");
});

// GET: Retrieve users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start application
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
};

startServer();
