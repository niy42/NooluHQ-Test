import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { authServices } from "@/services/auth.services";
import { setOnboardingToken } from "@/redux/store/slices/authSlice";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegister() {
  const { control, handleSubmit, watch, reset } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = watch("password");

  const registerUser = useMutationService({
    service: authServices.signup,
    options: {
      successTitle: "Registration Successful",
      successMessage: "Your account has been created",
      redirectTo: "/verify-email",
      onSuccess: (response, helpers) => {
        const { navigate, variables } = helpers;
        if (!response?.onboardingToken) {
          console.warn("No onboarding token received from signup");
          return;
        }
        const { onboardingToken } = response;
        helpers.dispatch(setOnboardingToken(onboardingToken));
        if (variables) {
          navigate("/verify-email", {
            state: { email: variables.email },
          });
        }
      },
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    registerUser.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return {
    control,
    handleSubmit,
    watch,
    password,
    onSubmit,
    ...registerUser,
    reset,
  };
}
