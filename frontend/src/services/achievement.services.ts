import { ApiMethods } from "@/api/apiMethod";
import { createService } from "@/api/createService";

const achievementRoute = "/api/v1/achievement";

export const achievementServices = {
  createAchievement: createService(`${achievementRoute}`, ApiMethods.POST),
};
