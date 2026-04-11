import express from "express";
import {
  uploadFile,
  getFiles,
  getDownloadUrl,
  getFileByCode,
  startMultipartUpload,
  uploadChunkPart,
  completeMultipartUpload,
} from "../controllers/fileController.js";

import { upload, uploadChunk } from "../middlewares/multer.middleware.js";
import { protect, optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Normal upload
router.post("/upload", optionalAuth, upload.single("file"), uploadFile);

// 🔥 Chunked upload routes
router.post("/start-upload", protect, startMultipartUpload);
router.post("/upload-chunk", protect, uploadChunk.single("file"), uploadChunkPart);
router.post("/complete-upload", protect, completeMultipartUpload);

// existing
router.get("/", protect, getFiles);
router.get("/download/:fileId", protect, getDownloadUrl);
router.get("/code/:code", getFileByCode);

export default router;