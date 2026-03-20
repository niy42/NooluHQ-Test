import { createService } from "@/api/createService";
import { ApiMethods } from "@/api/apiMethod";

const authRoute = "/api/v1/user";

export const userProfileServices = {
  userProfile: createService(`${authRoute}/user`, ApiMethods.POST),
};
