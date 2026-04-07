import File from "../models/File.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const newFile = await File.create({
    fileName: req.file.filename,
    fileSize: req.file.size,
    filePath: req.file.path,   // now from multer middleware
  });

  res
    .status(201)
    .json(new ApiResponse(201, newFile, "File uploaded successfully"));
});

const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find();

  res
    .status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));
});

export { uploadFile, getFiles };