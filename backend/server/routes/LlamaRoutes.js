import express from "express";
import { generateCustomAnswer, matchPercentage } from "../controllers/LlamaController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/custom-answer", authMiddleware, generateCustomAnswer);
router.post("/match-percentage", authMiddleware, matchPercentage);

export default router;
