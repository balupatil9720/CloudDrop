import express from "express";
import {
  uploadFile,
  getFiles,
  getDownloadUrl,
  getFileByCode
} from "../controllers/fileController.js";

import { upload } from "../middlewares/multer.middleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔥 Protected routes
router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);

// 🔐 Protected download
router.get("/download/:fileId", protect, getDownloadUrl);

// 🌐 Public access via code
router.get("/code/:code", getFileByCode);

export default router;