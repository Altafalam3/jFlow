import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  extractResumeDetails
} from "../controllers/AssistantController.js";
import uploadMiddleware from "../middleware/multerUpload.js";

const router = express.Router();

router.post("/extract-resume", uploadMiddleware.single("resume"), authMiddleware, extractResumeDetails);

export default router;
