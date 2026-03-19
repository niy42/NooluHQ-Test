import { Router } from "express";
import {
  login,
  resendVerification,
  signup,
  verifyEmail,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
export default router;
