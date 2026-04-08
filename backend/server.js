import dotenv from "dotenv";
dotenv.config();   // 🔥 NO path, no extras

import connectDB from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await connectDB();

    console.log("ACCESS:", process.env.AWS_ACCESS_KEY_ID);
    console.log("SECRET:", process.env.AWS_SECRET_ACCESS_KEY);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error.message);
    process.exit(1);
  }
};

startServer();