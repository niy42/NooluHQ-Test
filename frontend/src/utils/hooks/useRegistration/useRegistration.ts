import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { authServices } from "@/services/auth.services";

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

  // In useRegister.ts (or wherever you call useMutationService)
  const registerUser = useMutationService({
    service: authServices.signup,
    options: {
      successTitle: "Registration Successful",
      successMessage: "Your account has been created",
      redirectTo: "/verify-email",
      onSuccess: (_response, helpers) => {
        const { navigate, variables } = helpers;
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
