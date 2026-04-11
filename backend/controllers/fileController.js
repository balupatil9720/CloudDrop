import File from "../models/File.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import fs from "fs";
import {
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import { generateCode } from "../utils/generateCode.js";


// ================= NORMAL UPLOAD =================
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  // 🔥 FILE SIZE VALIDATION
  const isGuest = !req.user;
  const maxSize = isGuest
    ? 10 * 1024 * 1024
    : 100 * 1024 * 1024;

  if (req.file.size > maxSize) {
    throw new ApiError(
      400,
      isGuest
        ? "Guest upload limit is 10MB"
        : "User upload limit is 100MB"
    );
  }

  const fileContent = fs.readFileSync(req.file.path);

  const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype,
    })
  );

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  // 🔑 Generate unique code
  let code;
  let exists = true;

  while (exists) {
    code = generateCode();
    exists = await File.findOne({ code });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (req.user ? 21 : 2));

  const newFile = await File.create({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileUrl,
    fileKey,
    code,
    isGuest,
    expiresAt,
    uploadedBy: req.user?._id || null,
  });

  fs.unlinkSync(req.file.path);

  res.status(201).json(
    new ApiResponse(201, newFile, "File uploaded successfully")
  );
});


// ================= CHUNKED UPLOAD =================

// 🔥 START MULTIPART
const startMultipartUpload = asyncHandler(async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileSize) {
    throw new ApiError(400, "File details required");
  }

  const isGuest = !req.user;

  const maxSize = isGuest
    ? 10 * 1024 * 1024
    : 100 * 1024 * 1024;

  if (fileSize > maxSize) {
    throw new ApiError(
      400,
      isGuest
        ? "Guest upload limit is 10MB"
        : "User upload limit is 100MB"
    );
  }

  const key = `uploads/${Date.now()}-${fileName}`;

  const response = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    })
  );

  res.json({
    uploadId: response.UploadId,
    key,
  });
});


// 🔥 UPLOAD CHUNK
const uploadChunkPart = asyncHandler(async (req, res) => {
  const { uploadId, key, partNumber } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Chunk file missing");
  }

  const response = await s3.send(
    new UploadPartCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      PartNumber: Number(partNumber),
      Body: req.file.buffer,
    })
  );

  res.json({
    ETag: response.ETag,
    partNumber: Number(partNumber),
  });
});


// 🔥 COMPLETE MULTIPART
const completeMultipartUpload = asyncHandler(async (req, res) => {
  const { uploadId, key, parts, fileSize } = req.body;

  if (!uploadId || !key || !parts) {
    throw new ApiError(400, "Upload data missing");
  }

  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    })
  );

  // 🔑 Generate unique code
  let code;
  let exists = true;

  while (exists) {
    code = generateCode();
    exists = await File.findOne({ code });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 21);

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  const newFile = await File.create({
    fileName: key.split("-").slice(1).join("-"),
    fileSize: fileSize, // ✅ FIXED
    fileUrl,
    fileKey: key,
    code,
    isGuest: false,
    expiresAt,
    uploadedBy: req.user._id,
  });

  res.json(
    new ApiResponse(200, newFile, "Chunk upload completed")
  );
});


// ================= FILE FETCH =================
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({
    uploadedBy: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, files, "Files fetched successfully")
  );
});


// ================= DOWNLOAD (PRIVATE) =================
const getDownloadUrl = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);

  if (!file) throw new ApiError(404, "File not found");

  if (file.uploadedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  if (new Date() > file.expiresAt) {
    throw new ApiError(410, "File expired");
  }

  const key = file.fileUrl.split(".amazonaws.com/")[1];

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 60 }
  );

  file.downloadCount += 1;
  file.lastDownloadedAt = new Date();
  await file.save();

  res.status(200).json(
    new ApiResponse(200, { url: signedUrl }, "Download URL generated")
  );
});


// ================= PUBLIC DOWNLOAD =================
const getFileByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const file = await File.findOne({ code });

  if (!file) throw new ApiError(404, "Invalid code");

  if (new Date() > file.expiresAt) {
    throw new ApiError(410, "File expired");
  }

  const key = file.fileUrl.split(".amazonaws.com/")[1];

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 60 }
  );

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


// ================= EXPORT =================
export {
  uploadFile,
  getFiles,
  getDownloadUrl,
  getFileByCode,
  startMultipartUpload,
  uploadChunkPart,
  completeMultipartUpload,
};