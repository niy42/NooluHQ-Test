// hooks/useVerify.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { authServices } from "@/services/auth.services";
import {
  selectEmail,
  setOnboardingProgress,
  setOnboardingToken,
} from "@/redux/store/slices/authSlice";
import { defaultProgress } from "../useOnboardingProgress/useOnboardingProgress";
import { useAppSelector } from "@/redux/store/hooks";

export interface VerifyFormValues {
  code: string;
}

export function useVerify(email: string) {
  const { control, handleSubmit, setValue, reset } = useForm<VerifyFormValues>({
    defaultValues: { code: "" },
  });
  const emailFromRedux = useAppSelector(selectEmail);
  const verifyUser = useMutationService({
    service: authServices.verifyEmail,
    options: {
      successTitle: "Verification Successful",
      successMessage: "Your email has been verified",

      onSuccess: (response: any, helper) => {
        const { onboardingToken, progress } = response;
        helper.dispatch(setOnboardingToken(onboardingToken));
        helper.dispatch(setOnboardingProgress(progress));
        helper.navigate("/join-us");
        reset();
      },
      optimisticUpdate: {
        queryKey: ["onboarding-progress"],
        updateFn: (oldData, _variables) => {
          if (!oldData?.progress) {
            return {
              success: true,
              progress: {
                ...defaultProgress,
                currentStep: 2,
                completedSteps: [...defaultProgress.completedSteps, 1],
                percentage: Math.min(
                  Math.round(
                    ((defaultProgress.completedSteps.length + 1) /
                      defaultProgress.totalSteps) *
                      100,
                  ),
                  100,
                ),
              },
            };
          }

          const prevProgress = oldData.progress;
          const stepCompleted = 1;

          const updatedCompleted = prevProgress.completedSteps.includes(
            stepCompleted,
          )
            ? prevProgress.completedSteps
            : [...prevProgress.completedSteps, stepCompleted];

          const newProgress = {
            ...prevProgress,
            currentStep: stepCompleted + 1,
            completedSteps: updatedCompleted,
            percentage: Math.min(
              Math.round(
                (updatedCompleted.length / prevProgress.totalSteps) * 100,
              ),
              100,
            ),
          };

          return {
            ...oldData,
            progress: newProgress,
          };
        },
      },
      invalidateKeys: ["onboarding-progress"],
    },
  });

  const resendMutation = useMutationService({
    service: authServices.resendVerification,
    options: {
      successTitle: "Code Resent",
      successMessage: "A new verification code has been sent",
      onSuccess: (response: any, helper) => {
        helper.enqueueSnackbar(`New otp sent: ${response.newOtp}`, {
          variant: "success",
        });
        console.log("NewOtp: ", response.newOtp);
      },
    },
  });

  const onSubmit: SubmitHandler<VerifyFormValues> = (data) => {
    if (verifyUser.isPending) return;
    verifyUser.mutate({
      code: data.code,
      email,
    });
  };

  const setCode = (newCode: string) => {
    setValue("code", newCode, { shouldValidate: true });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    setCode,

    verify: verifyUser.mutate,
    isVerifying: verifyUser.isPending,
    verifyError: verifyUser.error,

    resendCode: () => {
      resendMutation.mutate({ email: emailFromRedux });
    },
    isResending: resendMutation.isPending,
    isVerifySuccess: resendMutation.isSuccess,
    resendError: resendMutation.error,
  };
}
