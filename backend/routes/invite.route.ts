import { Router } from "express";
import { inviteTeammate } from "../controllers/invite.controller";
import { authenticateOnboarding } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticateOnboarding);
router.post("/team-members", inviteTeammate);

export default router;
