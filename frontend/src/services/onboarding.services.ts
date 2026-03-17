import { ApiMethods } from "@/api/apiMethod";
import { createService } from "@/api/createService";

const onboardingRoute = "/api/v1/onboarding";
const onboardingProgressRoute = "api/v1/progress";

export const onboardingServices = {
  saveWhoIsJoining: createService(
    `${onboardingRoute}/who-is-joining`,
    ApiMethods.POST,
  ),
  getOnboardingProgress: createService(
    `${onboardingProgressRoute}`,
    ApiMethods.GET,
  ),
};
