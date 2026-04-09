import cron from "node-cron";
import File from "../models/File.js";
import s3 from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteExpiredFiles = async () => {
  try {
    console.log("🕒 Running cron job...");

    const expiredFiles = await File.find({
      expiresAt: { $lt: new Date() },
    });

    console.log(`📂 Found ${expiredFiles.length} expired files`);

    for (const file of expiredFiles) {
      try {
        // 🔥 Get fileKey safely
        let key = file.fileKey;

        // fallback if old data doesn't have fileKey
        if (!key && file.fileUrl) {
          key = file.fileUrl.split(".amazonaws.com/")[1];
        }

        if (key) {
          const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
          });

          await s3.send(command);
        }

        // 🔥 Delete from MongoDB
        await File.findByIdAndDelete(file._id);

        console.log(`✅ Deleted: ${file.fileName}`);
      } catch (err) {
        console.error("❌ Error deleting file:", err.message);
      }
    }

    console.log("✅ Cron job completed\n");
  } catch (error) {
    console.error("❌ Cron error:", error.message);
  }
};

const startCronJob = () => {
  // ⏰ Every 6 hours
  cron.schedule("0 */6 * * *", deleteExpiredFiles);
//  cron.schedule("* * * * *", deleteExpiredFiles);

  console.log("🟢 Cron job scheduled (every 6 hours)");
};

export default startCronJob;