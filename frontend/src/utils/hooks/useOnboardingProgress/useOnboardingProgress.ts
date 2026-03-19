import { onboardingServices } from "@/services/onboarding.services";
import { useQueryService } from "@/utils/hooks/Tanstack/useQueryService";

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  percentage: number;
  isComplete: boolean;
  onboardingComplete: boolean;
}

export const defaultProgress: OnboardingProgress = {
  currentStep: 1,
  completedSteps: [],
  totalSteps: 4,
  percentage: 0,
  isComplete: false,
  onboardingComplete: false,
};

export const useOnboardingProgress = () => {
  const { data, isLoading, error } = useQueryService<
    object,
    { success: boolean; progress: OnboardingProgress }
  >({
    service: onboardingServices.getOnboardingProgress,
    options: {
      keys: ["onboarding-progress"],
      staleTime: 60_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  });

  const progress = data?.progress ?? defaultProgress;

  return {
    progress,
    isLoading,
    isError: !!error,
    error,
  };
};
