import multer from "multer";
import path from "path";
import fs from "fs";

// ensure folder exists
const uploadPath = "public/temp";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
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

const fileFilter = (req, file, cb) => {
  // allow all for now (later restrict types)
  cb(null, true);
};

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});