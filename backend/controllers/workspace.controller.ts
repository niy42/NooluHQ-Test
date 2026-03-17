import { Request, Response } from "express";
import { Workspace } from "../models/Workspace";

export async function createWorkspace(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { workspace } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!workspace)
    return res.status(400).json({ message: "Workspace name is required" });

  const newWorkspace = await Workspace.create({ userId, name: workspace });

  res.status(201).json({
    message: "Workspace created",
    workspace: {
      id: newWorkspace.id,
      name: newWorkspace.name,
    },
  });
}
