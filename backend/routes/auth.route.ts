import { Router } from "express";
import {
  resendVerification,
  signup,
  verifyEmail,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
export default router;
