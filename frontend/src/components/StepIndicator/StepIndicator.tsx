import { useOnboardingProgress } from "@/utils/hooks/useOnboardingProgress/useOnboardingProgress";
import classNames from "classnames";
import { Check } from "lucide-react";
import { steps } from "../constants";

export default function StepIndicator() {
  const { progress, isLoading, error } = useOnboardingProgress();

  const completedSteps = progress?.completedSteps ?? [];
  const completedSet = new Set(completedSteps.map((s) => Number(s)));
  const currentStep = progress?.currentStep ?? 1;

  console.log("Current step: ", currentStep);

  if (isLoading) {
    return <div className="text-gray-500">Loading progress...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load progress</div>;
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSet.has(stepNumber);
        const isActive = stepNumber === Math.min(currentStep, steps.length);
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
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                  {
                    "bg-indigo-500 text-white": isCompleted || isActive,
                    "scale-110": isActive,
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
                      "absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-500 ease-in-out",
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
                className={classNames("text-sm transition-all duration-300", {
                  "translate-x-1 font-medium text-indigo-500": isActive,
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
