import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import experienceRoutes from "./routes/experience.route.js";
import aiRoutes from "./routes/ai.route.js";
import userRoutes from "./routes/user.route.js";
import preparationRoutes from "./routes/preparation.route.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes 
app.use("/api/auth", authRoutes);        
app.use("/api/experiences", experienceRoutes); 
app.use("/api/ai", aiRoutes);           
app.use("/api/users", userRoutes);       
app.use("/api/preparations", preparationRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the Server
app.listen(PORT, () => {
  connectDB(); // Connect to MongoDB when server starts
  console.log(`Server running on port ${PORT}`);
});