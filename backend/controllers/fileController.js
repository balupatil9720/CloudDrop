import File from "../models/File.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  // read file from local temp storage
  const fileContent = fs.readFileSync(req.file.path);

  // unique key for S3
  const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;

  // upload to S3
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileContent,
    ContentType: req.file.mimetype,
  });

 try {
  await s3.send(command);
} catch (error) {
  console.error("S3 ERROR:", error);  // 🔥 ADD THIS
  throw new ApiError(500, error.message);
} 

  // generate file URL
  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  // store in MongoDB
  const newFile = await File.create({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileUrl: fileUrl, // 🔥 NEW FIELD
  });

  // delete local temp file
  fs.unlinkSync(req.file.path);

  res
    .status(201)
    .json(new ApiResponse(201, newFile, "File uploaded to S3 successfully"));
});

const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find();

  res
    .status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));
});

export { uploadFile, getFiles };