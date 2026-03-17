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
  console.log("[AUTH] Authorization header:", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[AUTH] No valid Bearer token");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[AUTH] Token (first 20 chars):", token?.slice(0, 20));

  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as OnboardingPayload;
    console.log("[AUTH] Decoded:", decoded);

    if (decoded.purpose !== "onboarding") {
      return res.status(403).json({ message: "Invalid token purpose" });
    }

    // @ts-ignore
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err: any) {
    console.error("Onboarding token verification failed:", err.message);
    console.error("[AUTH] Verify failed:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Onboarding session expired" });
    }

    return res.status(401).json({ message: "Invalid onboarding token" });
  }
};

// export const optionalOnboardingAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return next();
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as OnboardingPayload;

//     if (decoded.purpose === "onboarding") {
//       //@ts-ignore
//       req.user = { id: decoded.id, email: decoded.email };
//     }
//   } catch (err) {}

//   next();
// };
