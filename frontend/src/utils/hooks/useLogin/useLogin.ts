import { useMutationService } from "./useMutationService";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginSuccess } from "@/redux/store/slices/authSlice";
import { authServices } from "@/services/auth.services";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutationService<LoginRequest, LoginResponse>({
    service: authServices.login,
    options: {
      onSuccess: (response) => {
        dispatch(
          loginSuccess({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          }),
        );
      },
      successTitle: "Login Successful",
      successMessage: "Welcome back!",
    },
  });
};
