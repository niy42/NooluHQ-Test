import { ApiMethods } from "@/api/apiMethod";
import { createService } from "@/api/createService";

const workSpaceRoute = "/api/v1/workspace";

export const workspaceServices = {
  createWorkspace: createService(`${workSpaceRoute}/create`, ApiMethods.POST),
};
