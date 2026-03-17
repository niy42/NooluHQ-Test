import { useOnboardingProgress } from "@/utils/hooks/useOnboardingProgress/useOnboardingProgress";
import classNames from "classnames";
import { Check } from "lucide-react";
import { steps } from "../constants";
import { useAppSelector } from "@/redux/store/hooks";
import { selectOnboardingProgress } from "@/redux/store/slices/authSlice";

export default function StepIndicator() {
  const { data, isLoading, error } = useOnboardingProgress();
  const progress = useAppSelector(selectOnboardingProgress) ?? data?.progress;

  const completedSteps = (() => {
    if (!progress?.completedSteps) return [];
    if (Array.isArray(progress.completedSteps)) return progress.completedSteps;
    try {
      return JSON.parse(progress.completedSteps);
    } catch {
      return [];
    }
  })();

  const completedSet = new Set(completedSteps.map((s: any) => Number(s)));
  const currentStep = progress?.currentStep ?? 1;

  if (isLoading) {
    return <div className="text-gray-500">Loading progress...</div>;
  }

  if (error || !data?.success) {
    return <div className="text-red-500">Failed to load progress</div>;
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSet.has(stepNumber);
        const isActive = stepNumber === currentStep;
        const isFuture = stepNumber > currentStep;
        const last = index === steps.length - 1;

        return (
          <div
            key={step}
            className={classNames("flex items-start gap-4", {
              "cursor-pointer": !isFuture,
              "cursor-not-allowed opacity-60": isFuture,
            })}
            onClick={() => {
              if (!isFuture) {
                console.log(`Go to step ${stepNumber}`);
              }
            }}
          >
            <div className="flex flex-col items-center">
              <div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition",
                  {
                    "bg-indigo-500 text-white": isActive || isCompleted,
                    "border border-gray-300 text-gray-500": isFuture,
                  },
                )}
              >
                {isCompleted ? <Check size={16} /> : stepNumber}
              </div>

              {!last && (
                <div className="relative my-2 h-8 w-px bg-gray-300">
                  <div
                    className={classNames(
                      "absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-300",
                      {
                        "h-full": isCompleted,
                        "h-0": !isCompleted,
                      },
                    )}
                  />
                </div>
              )}
            </div>

            <div className="pt-1">
              <p
                className={classNames("text-sm transition", {
                  "font-medium text-indigo-500": isActive,
                  "text-gray-400": isFuture,
                  "text-gray-600": isCompleted && !isActive,
                })}
              >
                {step}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
