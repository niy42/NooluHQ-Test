import { onboardingServices } from "@/services/onboarding.services";
import { useQueryService } from "@/utils/hooks/Tanstack/useQueryService";

export interface OnboardingProgressResponse {
  success: boolean;
  progress: {
    currentStep: number;
    completedSteps: number[];
    totalSteps: number;
    percentage: number;
    isComplete: boolean;
  };
}

export const useOnboardingProgress = () => {
  return useQueryService<object, OnboardingProgressResponse>({
    service: onboardingServices.getOnboardingProgress,
    options: {
      keys: ["onboarding-progress"],
      staleTime: 60_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });
};
