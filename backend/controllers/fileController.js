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


// ✅ Upload File (S3 + Code + Expiry)
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  // read file
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

  // 🔥 Generate unique 6-digit code
  let code;
  let exists = true;

  while (exists) {
    code = generateCode();
    const existingFile = await File.findOne({ code });
    exists = !!existingFile;
  }

  // 🔥 Expiry logic
  const isGuest = true; // will change after auth

  const expiryDays = isGuest ? 2 : 21;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  // save to DB
  const newFile = await File.create({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileUrl,
    code,
    isGuest,
    expiresAt,
  });

  // delete temp file
  fs.unlinkSync(req.file.path);

  res.status(201).json(
    new ApiResponse(
      201,
      newFile,
      "File uploaded successfully"
    )
  );
});


// ✅ Get all files
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, files, "Files fetched successfully")
  );
});


// 🔐 Download using fileId
const getDownloadUrl = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  // ❌ block expired
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

  res.status(200).json(
    new ApiResponse(
      200,
      {
        url: signedUrl,
        expiresAt: file.expiresAt,
      },
      "Download URL generated"
    )
  );
});


// 🔥 Access via 6-digit code
const getFileByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const file = await File.findOne({ code });

  if (!file) {
    throw new ApiError(404, "Invalid code");
  }

  // ❌ block expired
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

  // increment download count
  file.downloadCount += 1;
  await file.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        fileName: file.fileName,
        url: signedUrl,
        downloads: file.downloadCount,
        expiresAt: file.expiresAt,
      },
      "File accessed via code"
    )
  );
});


export { uploadFile, getFiles, getDownloadUrl, getFileByCode };