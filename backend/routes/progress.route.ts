import { Router } from "express";
import { getUserProgress } from "../controllers/onboarding.controller";

const router = Router();

router.get("/", getUserProgress);

export default router;
