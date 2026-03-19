import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp } from "../utils/generateOtp";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // 1. Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  // 2. Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid email or password" });

  // 3. Optional: check if email is verified
  if (!user.onboardingComplete) {
    return res.status(403).json({
      error: "Email not verified. Complete onboarding first.",
    });
  }

  // 4. Generate auth token
  const authToken = jwt.sign(
    { id: user.id, email: user.email, purpose: "auth" },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  // 5. Optional: send login notification email
  // try {
  //   await sendEmail(
  //     email,
  //     "Login Alert - Diag App",
  //     `<p>You just logged in to your account.</p>`
  //   );
  // } catch (err) {
  //   console.error("Email failed:", err);
  // }

  res.json({
    message: "Login successful",
    authToken,
  });
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOtp(6);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const newUser = await User.create({
    email,
    password: hashed,
    verificationToken: otp,
    verificationExpiresAt: expiresAt,
    currentStep: 1,
    completedSteps: [],
    onboardingComplete: false,
  });

  const emailText = `Your verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it.`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Use this 6-digit code to complete your registration:</p>
      <h1 style="letter-spacing: 8px; font-size: 32px; font-weight: bold;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, ignore this email.</p>
      <p>— Diag App Team</p>
    </div>
  `;

  try {
    await sendEmail(
      email,
      "Verify Your Diag Account - Your Code Awaits",
      emailHtml,
    );
  } catch (err) {
    console.error("Email failed:", err);
  }

  const onboardingToken = jwt.sign(
    { id: newUser.id, email: newUser.email, purpose: "onboarding" },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  res.json({
    message: "Check your email for a 6-digit verification code",
    onboardingToken,
  });
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

  res.json({ message: "New code sent to your email" });
}
