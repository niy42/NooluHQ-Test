import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

interface OnboardingPayload {
  id: number;
  email: string;
  purpose: "onboarding";
  iat?: number;
  exp?: number;
}

export const authenticateOnboarding = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[AUTH] No token, continuing as guest");
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as OnboardingPayload;

    if (decoded.purpose !== "onboarding") {
      return res.status(403).json({ message: "Invalid token purpose" });
    }

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (err: any) {
    console.error("[AUTH] Verify failed:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please restart onboarding.",
      });
    }

    return res.status(401).json({ message: "Invalid onboarding token" });
  }
};
