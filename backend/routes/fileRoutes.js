import express from "express";
import {
  uploadFile,
  getFiles,
  getDownloadUrl,
  getFileByCode
} from "../controllers/fileController.js";

import { upload } from "../middlewares/multer.middleware.js";
import { protect, optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔥 Upload → guest + user allowed
router.post("/upload", optionalAuth, upload.single("file"), uploadFile);

// 🔐 Only logged-in users can see their files
router.get("/", protect, getFiles);

// 🔐 Secure download
router.get("/download/:fileId", protect, getDownloadUrl);

// 🌐 Public access via code
router.get("/code/:code", getFileByCode);

export default router;