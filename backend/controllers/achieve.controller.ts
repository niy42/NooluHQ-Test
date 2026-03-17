import { Request, Response } from "express";
import { User } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function saveAchievement(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { goal, description } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    user.goal = goal;
    user.goalDescription = description;

    const thisStep = 4;

    if (!user.completedSteps.includes(thisStep)) {
      user.completedSteps = [...user.completedSteps, thisStep];
    }

    user.currentStep = 5;

    if (user.currentStep > 4) {
      user.onboardingComplete = true;
    }

    await user.save();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const updatedCompletedSteps = user?.completedSteps || [];
    const totalSteps = 4;

    const progress = {
      currentStep: user.currentStep,
      completedSteps: updatedCompletedSteps,
      onboardingComplete: user.onboardingComplete,
      totalSteps,
      percentage: Math.round((updatedCompletedSteps.length / totalSteps) * 100),
      isComplete: user.onboardingComplete,
    };

    res.json({
      message: "Achievement saved successfully",
      progress,
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
