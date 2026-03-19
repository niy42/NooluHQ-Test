import { useMutationService } from "../Tanstack/useMutationService";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginSuccess } from "@/redux/store/slices/authSlice";
import { authServices } from "@/services/auth.services";
import type { RegisterFormValues } from "../useRegistration/useRegistration";
import { useForm, type SubmitHandler } from "react-hook-form";

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const loginUser = useMutationService({
    service: authServices.login,
    options: {
      redirectTo: "/dashboard",
      onSuccess: (response: any) => {
        dispatch(
          loginSuccess({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          }),
        );
        reset();
      },
      successTitle: "Login Successful",
      successMessage: "Welcome back!",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    loginUser.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return { control, handleSubmit, onSubmit, ...loginUser };
};
