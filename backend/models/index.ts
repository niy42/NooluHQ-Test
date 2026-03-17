import { Invite } from "./Invite";
import { User } from "./User";
import { Workspace } from "./Workspace";

export * from "./User";
export * from "./Workspace";
export * from "./Invite";

// Optional: single object
export const models = {
  User,
  Workspace,
  Invite,
};
