// hooks/useWhoIsJoining.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { onboardingServices } from "@/services/onboarding.services";
import {
  defaultProgress,
  useOnboardingProgress,
} from "../useOnboardingProgress/useOnboardingProgress";

type FormValues = {
  name: string;
  role: string;
  teamSize: string;
};

export function useWhoIsJoining() {
  const { advanceStep } = useOnboardingProgress();
  const { control, handleSubmit, watch, reset, register } = useForm<FormValues>(
    {
      defaultValues: {
        name: "",
        role: "",
        teamSize: "just-me",
      },
    },
  );

  const saveProfile = useMutationService({
    service: onboardingServices.saveWhoIsJoining,
    options: {
      successTitle: "Great! Let's continue",
      successMessage: "Your details have been saved",
      redirectTo: "/create-workspace",
      onSuccess: () => {
        // const { queryClient } = helpers;
        // const { progress: backendProgress } = response as any;

        // queryClient.setQueryData(["onboarding-progress"], {
        //   success: true,
        //   progress: backendProgress,
        // });

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
                currentStep: 3,
                completedSteps: [...defaultProgress.completedSteps, 2],
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
          const stepCompleted = 2;

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (saveProfile.isPending) return;

    advanceStep(2);
    saveProfile.mutate(data);
  };

  return {
    control,
    handleSubmit,
    watch,
    onSubmit,
    ...saveProfile,
    reset,
    register,
  };
}
