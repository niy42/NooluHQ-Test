import { Router } from "express";

import { authenticateOnboarding } from "../middleware/auth.middleware";
import { saveAchievement } from "../controllers/achieve.controller";

const router = Router();
router.use(authenticateOnboarding);
router.post("/", saveAchievement);

export default router;
