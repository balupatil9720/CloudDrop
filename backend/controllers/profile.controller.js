import File from "../models/File.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserProfileStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const files = await File.find({ uploadedBy: userId });

  const totalFiles = files.length;

  const totalStorage = files.reduce((acc, f) => acc + f.fileSize, 0);

  const totalDownloads = files.reduce((acc, f) => acc + f.downloadCount, 0);

  const now = new Date();

  const activeFiles = files.filter(f => new Date(f.expiresAt) > now).length;
  const expiredFiles = totalFiles - activeFiles;

  res.status(200).json(
    new ApiResponse(200, {
      name: req.user.name,     // ✅ ADD THIS
      email: req.user.email,   // ✅ ADD THIS
      totalFiles,
      totalStorage,
      totalDownloads,
      activeFiles,
      expiredFiles,
    }, "Profile stats fetched")
  );
});

export { getUserProfileStats };