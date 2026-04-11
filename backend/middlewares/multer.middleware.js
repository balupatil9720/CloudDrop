import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Disk storage (existing)
const uploadPath = "public/temp";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// 🔥 NEW → memory storage (for chunk upload)
const memoryStorage = multer.memoryStorage();

export const upload = multer({ storage: diskStorage });
export const uploadChunk = multer({ storage: memoryStorage }); // 🔥 NEW