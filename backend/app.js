import express from "express";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profile.routes.js";
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/files", fileRoutes);

app.use("/api", profileRoutes);

app.use(errorHandler);

export default app;