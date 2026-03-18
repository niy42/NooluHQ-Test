import { Router } from "express";
import { getUserProgress } from "../controllers/onboarding.controller";
import { authenticateOnboarding } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticateOnboarding);
router.get("/", getUserProgress);

export default router;
