import express from "express";
import { uploadFile, getFiles } from "../controllers/fileController.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// apis for file upload and retrieval
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);

export default router;