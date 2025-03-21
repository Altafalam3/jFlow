const express = require("express");
const cors = require("cors");
// const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/User");
const session = require("express-session");

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


app.use("/api/user", userRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb")
  } catch (error) {
    throw error;
  }
};


mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected")
})

mongoose.connection.on("connected", () => {
  console.log("mongodb connected")
})

app.get('/', (req, res) => {
  res.send("Hello")
})

const port = process.env.PORT || 8800;
const host = '0.0.0.0'

app.listen(port, host, () => {
  connectDB();
  console.log("connected to backend");
})