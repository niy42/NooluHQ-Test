import { useMutationService } from "../Tanstack/useMutationService";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginSuccess } from "@/redux/store/slices/authSlice";
import { authServices } from "@/services/auth.services";

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutationService({
    service: authServices.login,
    options: {
      onSuccess: (response: any) => {
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
