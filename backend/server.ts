import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { sequelize, connectDb } from "./config/db";
import authRoutes from "./routes/auth.route";
import workspaceRoutes from "./routes/workspace.route";
import userOnboardingRoutes from "./routes/user.route";
import inviteRoutes from "./routes/invite.route";
import achievementRoutes from "./routes/achieve.route";
import ProgressRoutes from "./routes/progress.route";
import "./models";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspace", workspaceRoutes);
app.use("/api/v1/invite", inviteRoutes);
app.use("/api/v1/onboarding", userOnboardingRoutes);
app.use("/api/v1/achievement", achievementRoutes);
app.use("/api/v1/progress", ProgressRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  try {
    await connectDb();
    await sequelize.sync({
      alter: true,
      // force: true,
      // logging: console.log,
    });
    console.log("Database synced - tables created/updated");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
