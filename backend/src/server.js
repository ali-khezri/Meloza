import express from "express";

import dotenv from "dotenv";

import path from "path";

import { connectDB } from "./lib/db.js";

import { clerkMiddleware } from "@clerk/express";

import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import songRoutes from "./routes/song.routes.js";
import albumRoutes from "./routes/album.routes.js";
import statRoutes from "./routes/stat.routes.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(clerkMiddleware());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //10Mb max file size
    },
  }),
);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/songs", songRoutes);

app.use("/api/albums", albumRoutes);

app.use("/api/stats", statRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// app.listen(PORT, () => {
//   console.log("Server is running on port: " + PORT);
//   connectDB();
// });

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  } catch (error) {
    process.exit(1);
  }
}

startServer();
