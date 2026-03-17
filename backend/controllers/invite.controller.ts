import { Request, Response } from "express";
import { Invite } from "../models/Invite";
import { generateToken } from "../utils/token";
import { sendEmail } from "../utils/sendEmail";

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

    const tokens = invite.map((email) => generateToken());

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

    await Promise.all(
      invite.map((email, index) =>
        sendEmail(
          email,
          "Workspace Invite",
          `Click to join: http://localhost:5173/invite?token=${tokens[index]}`,
        ),
      ),
    );

    res.status(201).json({ message: "Invitations sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while sending invites" });
  }
}
