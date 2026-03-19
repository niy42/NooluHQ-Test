// controllers/workspace.controller.ts
import { Request, Response } from "express";
import { Workspace } from "../models/Workspace";
import { User } from "../models/User";

export async function createWorkspace(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { workspace } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspace) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const newWorkspace = await Workspace.create({ userId, name: workspace });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stepJustCompleted = 3;
    if (!user.completedSteps.includes(stepJustCompleted)) {
      user.completedSteps = [...user.completedSteps, stepJustCompleted];
    }

    const totalSteps = 4;
    const nextStep = Math.min(Math.max(...user.completedSteps) + 1, totalSteps);
    const onboardingComplete = user.completedSteps.length >= totalSteps;

    user.currentStep = onboardingComplete ? totalSteps : nextStep;
    user.onboardingComplete = onboardingComplete;

    await user.save();

    const progress = {
      currentStep: user.currentStep,
      completedSteps: user.completedSteps,
      onboardingComplete: user.onboardingComplete,
      totalSteps,
      percentage: Math.round((user.completedSteps.length / totalSteps) * 100),
      isComplete: user.onboardingComplete,
    };

    res.status(201).json({
      message: "Workspace created",
      workspace: {
        id: newWorkspace.id,
        name: newWorkspace.name,
      },
      progress,
    });
  } catch (err) {
    console.error("Error creating workspace:", err);
    res.status(500).json({
      message: "Something went wrong while creating the workspace",
    });
  }
}
