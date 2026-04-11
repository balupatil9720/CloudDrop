import express from "express";
import { getUserProfileStats } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfileStats);

export default router;