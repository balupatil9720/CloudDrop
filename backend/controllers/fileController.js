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
import { generateCode } from "../utils/generateCode.js";

// ✅ Upload File (guest + user with limits)
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const MAX_GUEST_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_USER_SIZE = 100 * 1024 * 1024; // 100MB

  const isGuest = !req.user;

  if (isGuest && req.file.size > MAX_GUEST_SIZE) {
    throw new ApiError(400, "Guest users can upload max 10MB");
  }

  if (!isGuest && req.file.size > MAX_USER_SIZE) {
    throw new ApiError(400, "Users can upload max 100MB");
  }

  const fileContent = fs.readFileSync(req.file.path);

  const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileContent,
    ContentType: req.file.mimetype,
  });

  await s3.send(command);

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  // 🔑 Generate unique code
  let code;
  let exists = true;

  while (exists) {
    code = generateCode();
    const existingFile = await File.findOne({ code });
    exists = !!existingFile;
  }

  const expiryDays = isGuest ? 2 : 21;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const newFile = await File.create({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileUrl,
    fileKey,
    code,
    isGuest,
    expiresAt,
    uploadedBy: req.user?._id || null,
    status: "completed",
  });

  fs.unlinkSync(req.file.path);

  res.status(201).json(
    new ApiResponse(201, newFile, "File uploaded successfully")
  );
});

// ✅ Get user files (with expiry countdown + sorting)
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({
    uploadedBy: req.user._id,
  }).sort({ createdAt: -1 });

  const updatedFiles = files.map((file) => {
    const timeLeft = file.expiresAt - new Date();

    return {
      ...file.toObject(),
      expiresIn: Math.max(0, Math.floor(timeLeft / 1000)), // seconds
    };
  });

  res.status(200).json(
    new ApiResponse(200, updatedFiles, "Files fetched successfully")
  );
});

// 📊 Storage Usage
const getStorageStats = asyncHandler(async (req, res) => {
  const files = await File.find({ uploadedBy: req.user._id });

  const totalUsed = files.reduce((acc, file) => acc + file.fileSize, 0);

  res.status(200).json(
    new ApiResponse(200, {
      totalUsed,
      totalFiles: files.length,
    })
  );
});

// 📊 System Metrics
const getSystemMetrics = asyncHandler(async (req, res) => {
  const totalFiles = await File.countDocuments();
  const totalUserFiles = await File.countDocuments({ isGuest: false });
  const totalGuestFiles = await File.countDocuments({ isGuest: true });

  res.status(200).json(
    new ApiResponse(200, {
      totalFiles,
      totalUserFiles,
      totalGuestFiles,
    })
  );
});

// 🔐 Download (private)
const getDownloadUrl = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);

  if (!file) throw new ApiError(404, "File not found");

  if (
    file.uploadedBy &&
    file.uploadedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Access denied");
  }

  if (new Date() > file.expiresAt) {
    throw new ApiError(410, "File expired");
  }

  const key = file.fileUrl.split(".amazonaws.com/")[1];

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  file.downloadCount += 1;
  file.lastDownloadedAt = new Date();
  await file.save();

  res.status(200).json(
    new ApiResponse(200, { url: signedUrl }, "Download URL generated")
  );
});

// 🔑 Public access via code
const getFileByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const file = await File.findOne({ code });

  if (!file) throw new ApiError(404, "Invalid code");

  if (new Date() > file.expiresAt) {
    throw new ApiError(410, "File expired");
  }

  const key = file.fileUrl.split(".amazonaws.com/")[1];

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  file.downloadCount += 1;
  file.lastDownloadedAt = new Date();
  await file.save();

  res.status(200).json(
    new ApiResponse(200, {
      fileName: file.fileName,
      url: signedUrl,
      expiresAt: file.expiresAt,
      downloads: file.downloadCount,
    })
  );
});

export {
  uploadFile,
  getFiles,
  getDownloadUrl,
  getFileByCode,
  getStorageStats,
  getSystemMetrics,
};