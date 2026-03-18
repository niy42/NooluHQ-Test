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

    const stepJustCompleted = 2;
    if (!user.completedSteps.includes(stepJustCompleted)) {
      user.completedSteps = [...user.completedSteps, stepJustCompleted];
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

    let progress = {
      currentStep: 1,
      completedSteps: [],
      onboardingComplete: false,
      totalSteps: 4,
      percentage: 0,
      isComplete: false,
    };

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        const completedSteps = Array.isArray(user.completedSteps)
          ? user.completedSteps.map((s) => Number(s))
          : JSON.parse(user.completedSteps || "[]");

        progress = {
          currentStep: Number(user.currentStep) || 1,
          completedSteps,
          onboardingComplete: Boolean(user.onboardingComplete),
          totalSteps: 4,
          percentage: Math.min(
            Math.round((completedSteps.length / 4) * 100),
            100,
          ),
          isComplete: Boolean(user.onboardingComplete),
        };
      }
    }

    res.status(200).json({ success: true, progress });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ success: false, error: "Failed to fetch progress" });
  }
}
