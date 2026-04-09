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

// ✅ Upload
router.post("/upload", upload.single("file"), uploadFile);

// ✅ Get all files
router.get("/", getFiles);

// 🔐 Secure download
router.get("/download/:fileId", getDownloadUrl);

// Access through 6 digit unique code
router.get("/code/:code", getFileByCode);

export default router;