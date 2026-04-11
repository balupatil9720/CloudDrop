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
      default: 0,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: {
      type: Date,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isGuest: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["uploading", "completed"],
      default: "completed",
    },

    // 🔥 NEW → for resumable uploads
    uploadId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;