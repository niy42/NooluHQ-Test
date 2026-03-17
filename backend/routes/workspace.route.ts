import { Router } from "express";
import { createWorkspace } from "../controllers/workspace.controller";
import { authenticateOnboarding } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateOnboarding);

router.post("/create", createWorkspace);

export default router;
