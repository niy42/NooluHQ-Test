// hooks/useAchievement.ts
import { achievementServices } from "@/services/achievement.services";
import { useMutationService } from "../Tanstack/useMutationService";
import { loginSuccess } from "@/redux/store/slices/authSlice";

export function useAchievement() {
  const saveAchievement = useMutationService({
    service: achievementServices.createAchievement,
    options: {
      successTitle: "Nice choice!",
      successMessage: "We'll tailor your workspace based on your goal.",
      onSuccess: (response: any, helper) => {
        const { accessToken, refreshToken, user, progress } = response;
        const { onboardingComplete } = progress;
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
