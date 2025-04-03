import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/UserRoutes.js";
import llamaRoutes from "./routes/LlamaRoutes.js";
import assistantRoutes from "./routes/AssistantRoutes.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";

const app = express();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/llama", llamaRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
    res.send("Hello");
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
