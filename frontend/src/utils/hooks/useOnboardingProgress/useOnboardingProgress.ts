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
      keys: ["onboarding-progress"], // consistent with your mutation examples
      staleTime: 60_000, // 1 minute – good for progress
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // Optional: add if you want background refetch on reconnect
      // refetchOnReconnect: true,
    },
  });

  const progress = data?.progress ?? defaultProgress;

  // Optional: Keep this ONLY if you still have places calling advanceStep manually
  // → In 2026 best practice, remove it and rely 100% on mutation-based optimistic updates
  function advanceStep(stepCompleted: number) {
    console.warn(
      "advanceStep called directly – prefer using mutations with optimisticUpdate",
    );

    // If you must keep it: this version at least tries to patch cache too
    // (but mutations are still superior)
    // queryClient.setQueryData(["onboarding-progress"], (old: any) => {
    //   if (!old?.progress) return old;
    //   const prev = old.progress;
    //   const updated = prev.completedSteps.includes(stepCompleted)
    //     ? prev.completedSteps
    //     : [...prev.completedSteps, stepCompleted];
    //   return {
    //     ...old,
    //     progress: {
    //       ...prev,
    //       currentStep: stepCompleted + 1,
    //       completedSteps: updated,
    //       percentage: Math.min(
    //         Math.round((updated.length / prev.totalSteps) * 100),
    //         100
    //       ),
    //     },
    //   };
    // });

    // For now: still update local if you kept state (but we removed it)
  }

  return {
    progress,
    advanceStep, // ← consider deprecating/removing in future
    isLoading,
    isError: !!error,
    error,
  };
};
