import File from "../models/File.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import fs from "fs";
import {
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

// ✅ Upload File
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const fileContent = fs.readFileSync(req.file.path);

  const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileContent,
    ContentType: req.file.mimetype,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("S3 ERROR:", error);
    throw new ApiError(500, error.message);
  }

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  const newFile = await File.create({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileUrl,
  });

  fs.unlinkSync(req.file.path);

  res
    .status(201)
    .json(new ApiResponse(201, newFile, "File uploaded to S3 successfully"));
});

// ✅ Get all files
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));
});

// 🔐 Secure Download (Pre-signed URL)
const getDownloadUrl = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  // extract key from S3 URL
  const key = file.fileUrl.split(".amazonaws.com/")[1];

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60, // 60 seconds
  });

  res.status(200).json(
    new ApiResponse(200, { url: signedUrl }, "Download URL generated")
  );
});

export { uploadFile, getFiles, getDownloadUrl };