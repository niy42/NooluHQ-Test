import { createService } from "@/api/createService";
import { ApiMethods } from "@/api/apiMethod";
import type { User } from "@/redux/store/types";

const authRoute = "/api/v1/auth";

export interface SignupRequest {
  name?: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  onboardingToken?: string;
  user: User;
}

export const authServices = {
  signup: createService<SignupRequest, SignupResponse>(
    `${authRoute}/signup`,
    ApiMethods.POST,
  ),

  login: createService(`${authRoute}/login`, ApiMethods.POST),
  verifyEmail: createService(`${authRoute}/verify-email`, ApiMethods.POST),
  resendVerification: createService(
    `${authRoute}/resend-verification`,
    ApiMethods.POST,
  ),
};
