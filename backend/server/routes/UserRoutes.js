import express from "express";
import {
  AddUser,
  getUserDetails,
  login,
  updateUserDetails,
  getResume,
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/multerUpload.js";

const router = express.Router();

router.post("/signup", uploadMiddleware.single("resume"), AddUser);
router.post("/login", login);

router.get("/", authMiddleware, getUserDetails);
router.patch(
  "/",
  authMiddleware,
  uploadMiddleware.single("resume"),
  updateUserDetails
);

router.get("/resume", authMiddleware, getResume);

export default router;