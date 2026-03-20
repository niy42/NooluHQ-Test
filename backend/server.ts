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

const allowedOrigins = [
  "http://localhost:5173",
  "https://diag-app.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspace", workspaceRoutes);
app.use("/api/v1/invite", inviteRoutes);
app.use("/api/v1/onboarding", userOnboardingRoutes);
app.use("/api/v1/achievement", achievementRoutes);
app.use("/api/v1/progress", ProgressRoutes);
app.get("/", (req, res) => {
  res.send("Backend is live");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  try {
    await connectDb();
    await sequelize.sync({
      alter: true,
      force: true,
      // logging: console.log,
    });
    console.log("Database synced - tables created/updated");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(
        `- Public URL: ${process.env.RAILWAY_STATIC_URL || "Check Railway dashboard"}`,
      );
      console.log(`- Listening on port: ${PORT}`);
      console.log(
        `- Database connected: ${process.env.DATABASE_URL?.slice(0, 30)}...`,
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
