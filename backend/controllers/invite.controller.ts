import { Request, Response } from "express";
import { Invite } from "../models/Invite";
import { generateToken } from "../utils/token";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../models/User";

interface InviteTeammateBody {
  workspaceId: string;
  invite: string[];
}

export async function inviteTeammate(
  req: Request<{}, {}, InviteTeammateBody>,
  res: Response,
) {
  try {
    const { workspaceId, invite } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId || !invite?.length) {
      return res
        .status(400)
        .json({ message: "workspaceId and invite are required" });
    }

    const tokens = invite.map(() => generateToken());

    await Promise.all(
      invite.map((email, index) =>
        Invite.create({
          workspaceId,
          email,
          token: tokens[index],
          accepted: false,
        }),
      ),
    );

    // Send emails
    await Promise.all(
      invite.map((email, index) =>
        sendEmail(
          email,
          "Workspace Invite",
          `Click to join: https://diag-app.netlify.app/invite?token=${tokens[index]}`,
        ),
      ),
    );

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const stepJustCompleted = 4;

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

    res.status(201).json({ message: "Invitations sent", progress });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while sending invites" });
  }
}
