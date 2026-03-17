// hooks/useVerify.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { authServices } from "@/services/auth.services";
import {
  setOnboardingProgress,
  setOnboardingToken,
} from "@/redux/store/slices/authSlice";

export interface VerifyFormValues {
  code: string;
}

export function useVerify(email?: string) {
  const { control, handleSubmit, setValue, reset } = useForm<VerifyFormValues>({
    defaultValues: {
      code: "",
    },
  });

  const verifyUser = useMutationService({
    service: authServices.verifyEmail,
    options: {
      successTitle: "Verification Successful",
      successMessage: "Your email has been verified",
      // redirectTo: "/join-us",
      onSuccess: (response: any, helper) => {
        const { onboardingToken, progress } = response;
        helper.dispatch(setOnboardingToken(onboardingToken));
        helper.dispatch(setOnboardingProgress(progress));
        helper.queryClient.setQueryData(["onboarding-progress"], {
          success: true,
          progress,
        });
        helper.navigate("/join-us");
        reset();
      },
    },
  });

  const onSubmit: SubmitHandler<VerifyFormValues> = (data) => {
    verifyUser.mutate({
      code: data.code,
    });
  };

  const resendMutation = useMutationService({
    service: authServices.resendVerification,
    options: {
      successTitle: "Code Resent",
      successMessage: "A new verification code has been sent",
    },
  });

  const setCode = (newCode: string) => {
    setValue("code", newCode, { shouldValidate: true });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    setCode,
    ...verifyUser,
    resendMutation,
    resendCode: () => {
      if (!email) {
        console.warn("Email not available for resend");
        return;
      }
      resendMutation.mutate({ email });
    },
    isResending: resendMutation.isPending,
    resendError: resendMutation.error,
  };
}
