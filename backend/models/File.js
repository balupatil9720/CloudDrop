import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String
    },
    fileUrl: {
  type: String,
  required: true,
    },
    code: {
      type: String, // 6-digit access code
    },
    expiryDate: {
      type: Date,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String, // later: user ID (for auth)
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const File = mongoose.model("File", fileSchema);

export default File;