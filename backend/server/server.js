import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/UserRoutes.js";
import llamaRoutes from "./routes/LlamaRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/llama", llamaRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

const port = process.env.PORT || 8800;
const host = "0.0.0.0";

app.listen(port, host, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
