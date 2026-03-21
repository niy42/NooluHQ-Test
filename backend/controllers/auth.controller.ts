import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp } from "../utils/generateOtp";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Resend } from "resend";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("LOGIN ATTEMPT:", { email });

  try {
    const user = await User.findOne({ where: { email } });
    console.log("USER LOOKUP RESULT:", user ? "FOUND" : "NOT FOUND");

    if (!user) {
      console.warn("LOGIN FAILED: User not found", { email });
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("PASSWORD CHECK:", validPassword ? "VALID" : "INVALID");

    if (!validPassword) {
      console.warn("LOGIN FAILED: Invalid password", { email });
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.onboardingComplete) {
      console.warn("LOGIN BLOCKED: Onboarding incomplete", { email });
      return res.status(403).json({
        error: "Email not verified. Complete onboarding first.",
      });
    }

    console.log("GENERATING TOKENS...");
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    try {
      console.log("SENDING LOGIN EMAIL...");
      await sendEmail(
        email,
        "Login Alert - Diag App",
        `<p>You just logged in to your account.</p>`,
      );
      console.log("LOGIN EMAIL SENT SUCCESSFULLY");
    } catch (err) {
      console.error("EMAIL FAILED DURING LOGIN:", err);
    }

    console.log("LOGIN SUCCESS:", { userId: user.id });

    res.json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("LOGIN CONTROLLER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("SIGNUP ATTEMPT:", { email });

  try {
    const existing = await User.findOne({ where: { email } });
    console.log("EXISTING USER CHECK:", existing ? "EXISTS" : "NEW");

    if (existing) {
      console.warn("SIGNUP FAILED: Email already exists", { email });
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("HASHING PASSWORD...");
    const hashed = await bcrypt.hash(password, 10);

    const otp = generateOtp(6);
    console.log("OTP GENERATED");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log("CREATING USER...");
    const newUser = await User.create({
      email,
      password: hashed,
      verificationToken: otp,
      verificationExpiresAt: expiresAt,
      currentStep: 1,
      completedSteps: [],
      onboardingComplete: false,
    });

    console.log("USER CREATED:", { userId: newUser.id });

    const emailHtml = `
      <div>
        <h2>Verify your email address</h2>
        <p>Your code:</p>
        <h1>${otp}</h1>
      </div>
    `;

    try {
      console.log("SENDING VERIFICATION EMAIL...");
      await sendEmail(email, "Verify your email", emailHtml);
      console.log("VERIFICATION EMAIL SENT");
    } catch (err) {
      console.error("EMAIL FAILED DURING SIGNUP:", err);
    }

    console.log("GENERATING ONBOARDING TOKEN...");
    const onboardingToken = jwt.sign(
      { id: newUser.id, email: newUser.email, purpose: "onboarding" },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    console.log("SIGNUP SUCCESS:", { userId: newUser.id });

    res.json({
      message: "Check your email for a 6-digit verification code",
      onboardingToken,
      email,
      otp,
    });
  } catch (err) {
    console.error("SIGNUP CONTROLLER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { code } = req.body;

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Invalid code format" });
    }

    const user = await User.findOne({
      where: { verificationToken: code },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    if (user.verificationExpiresAt && user.verificationExpiresAt < new Date()) {
      return res.status(400).json({ error: "Code has expired" });
    }

    const completedSteps = user.completedSteps || [];
    const thisStep = 1;

    user.verified = true;
    user.verificationToken = "";
    user.verificationExpiresAt = null;

    if (!completedSteps.includes(thisStep)) {
      user.completedSteps = [...completedSteps, thisStep];
    }

    user.currentStep = 2;

    if (user.currentStep > 4) {
      user.onboardingComplete = true;
    }

    await user.save();

    const onboardingToken = jwt.sign(
      { id: user.id, email: user.email, purpose: "onboarding" },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );
    console.log("[VERIFY EMAIL] NEW TOKEN:", onboardingToken);
    const updatedCompletedSteps = user.completedSteps || [];
    const totalSteps = 4;

    const progress = {
      currentStep: user.currentStep,
      completedSteps: updatedCompletedSteps,
      onboardingComplete: user.onboardingComplete,
      totalSteps,
      percentage: Math.round((updatedCompletedSteps.length / totalSteps) * 100),
      isComplete: user.onboardingComplete,
    };

    console.log(`[VERIFY EMAIL] User ${user.id} verified`);
    console.log(
      `[VERIFY EMAIL] Persisted currentStep = ${user.currentStep}, completedSteps = ${JSON.stringify(
        user.completedSteps,
      )}`,
    );

    return res.json({
      message: "Email verified successfully",
      onboardingToken,
      progress,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      error: "Failed to verify email",
    });
  }
}

export async function resendVerification(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.verified) {
    return res.status(400).json({ error: "Email already verified" });
  }

  // Optional: check last sent time to prevent spam (e.g., 60s cooldown)
  // if (user.lastOtpSent && Date.now() - user.lastOtpSent < 60000) { ... }

  const newOtp = generateOtp(6);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.verificationToken = newOtp;
  user.verificationExpiresAt = expiresAt;
  // user.lastOtpSent = Date.now(); // optional cooldown field

  await user.save();
  const emailHtml = `
    <h2>New Verification Code</h2>
    <p>Your new 6-digit code is:</p>
    <h1 style="letter-spacing: 8px;">${newOtp}</h1>
    <p>Expires in 10 minutes.</p>
  `;

  try {
    await sendEmail(email, "New Verification Code - Diag App", emailHtml);
  } catch (err) {
    console.error("Resend email failed:", err);
    return res.status(500).json({ error: "Failed to resend code" });
  }

  res.json({ message: "New code sent to your email", newOtp });
}
