// controllers/onboarding.controller.ts
import { Request, Response } from "express";
import { User } from "../models/User";

export async function saveWhoIsJoining(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { name, role, teamSize } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    user.name = name?.trim() || user.name;
    user.role = role?.trim() || user.role;
    user.teamSize = teamSize || user.teamSize;

    const thisStep = 2;
    if (!user.completedSteps.includes(thisStep)) {
      user.completedSteps = [...user.completedSteps, thisStep];
    }
    user.currentStep = 3;

    if (user.currentStep > 4) {
      user.onboardingComplete = true;
    }

    await user.save();

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
      message: "Profile updated successfully",
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUserProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    console.log("[PROGRESS] req.user:", (req as any).user);

    let progressData: {
      currentStep: number;
      completedSteps: number[];
      onboardingComplete: boolean;
      totalSteps: number;
      percentage: number;
      isComplete: boolean;
    } = {
      currentStep: 1,
      completedSteps: [],
      onboardingComplete: false,
      totalSteps: 4,
      percentage: 0,
      isComplete: false,
    };

    if (userId) {
      console.log(`[PROGRESS] Token userId: ${userId}`);
      const user = await User.findByPk(userId, { raw: true });
      console.log(
        `[PROGRESS] DB userId: ${user?.id ?? "not found"}, currentStep: ${user?.currentStep ?? "N/A"}`,
      );
      // const user = await User.findByPk(userId, {
      //   attributes: ["currentStep", "completedSteps", "onboardingComplete"],
      // });

      if (user) {
        const completedCount = user.completedSteps?.length || 0;
        progressData = {
          currentStep: user.currentStep,
          completedSteps: user.completedSteps || [],
          onboardingComplete: user.onboardingComplete,
          totalSteps: 4,
          percentage: Math.round((completedCount / 4) * 100),
          isComplete: user.onboardingComplete,
        };
      }
    }

    res.status(200).json({
      success: true,
      progress: progressData,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch progress",
    });
  }
}
