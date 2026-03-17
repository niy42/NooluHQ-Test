import { ApiMethods } from "@/api/apiMethod";
import { createService } from "@/api/createService";

const inviteRoute = "/api/v1/invite";

export const inviteServices = {
  sendInvites: createService(`${inviteRoute}/team-members`, ApiMethods.POST),
};
