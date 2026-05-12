import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import activityRoutes from "./routes/activities.js";
import skillRoutes from "./routes/skills.js";
import projectRoutes from "./routes/projects.js";
import jobRoutes from "./routes/jobs.js";
import configRoutes from "./routes/config.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: "*" }));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/activities", authMiddleware, activityRoutes);
app.use("/api/skills", authMiddleware, skillRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);
app.use("/api/config", authMiddleware, configRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` LifeOS API running on http://localhost:${PORT}`);
});
