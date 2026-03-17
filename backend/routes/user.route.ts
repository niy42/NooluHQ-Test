import { Router } from "express";
import {
  getUserProgress,
  saveWhoIsJoining,
} from "../controllers/onboarding.controller";
import { authenticateOnboarding } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateOnboarding);

router.get("/progress", getUserProgress);
router.post("/who-is-joining", saveWhoIsJoining);
export default router;
