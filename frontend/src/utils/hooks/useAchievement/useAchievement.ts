// hooks/useAchievement.ts
import { achievementServices } from "@/services/achievement.services";
import { useMutationService } from "../Tanstack/useMutationService";
import { loginSuccess } from "@/redux/store/slices/authSlice";
import { defaultProgress } from "../useOnboardingProgress/useOnboardingProgress";

export function useAchievement() {
  const saveAchievement = useMutationService({
    service: achievementServices.createAchievement,
    options: {
      successTitle: "Nice choice!",
      successMessage: "We'll tailor your workspace based on your goal.",
      optimisticUpdate: {
        queryKey: ["onboarding-progress"],
        updateFn: (oldData, _variables) => {
          const prevProgress = oldData?.progress ?? defaultProgress;
          const stepCompleted = prevProgress.totalSteps;
          const updatedCompleted = prevProgress.completedSteps.includes(
            stepCompleted,
          )
            ? prevProgress.completedSteps
            : [...prevProgress.completedSteps, stepCompleted];

          const newProgress: typeof prevProgress = {
            ...prevProgress,
            currentStep: stepCompleted + 1,
            completedSteps: updatedCompleted,
            percentage: 100,
            isComplete: true,
            onboardingComplete: true,
          };

          return {
            ...oldData,
            success: true,
            progress: newProgress,
          };
        },
      },

      invalidateKeys: ["onboarding-progress"],

      onSuccess: (response: any, helper) => {
        const { accessToken, refreshToken, user } = response;
        const { onboardingComplete } = user;

        if (onboardingComplete) {
          helper.dispatch(
            loginSuccess({
              user,
              accessToken,
              refreshToken,
            }),
          );
          helper.navigate("/dashboard");
        }
        // Optional: you could add reset form / other cleanup here
      },
    },
  });

  const submitAchievement = (selectedOption: any) => {
    const payload = {
      goal: selectedOption.title,
      description: selectedOption.desc,
    };

    saveAchievement.mutate(payload);
  };

  return {
    submitAchievement,
    ...saveAchievement,
  };
}
