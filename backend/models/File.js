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
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String, // 🔥 ADD THIS (VERY IMPORTANT)
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: Date,
    },
    downloadCount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;