import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { inviteServices } from "@/services/invite.services";
import { defaultProgress } from "../useOnboardingProgress/useOnboardingProgress";

type FormValues = {
  email: string[];
};

export function useInvite({ workspaceId }: { workspaceId: string }) {
  const { control, handleSubmit, watch, reset, register, formState } =
    useForm<FormValues>({ defaultValues: { email: [] } });

  const sendInvites = useMutationService({
    service: inviteServices.sendInvites,
    options: {
      successTitle: "Invites sent!",
      successMessage: "Your teammates have been invited successfully.",
      redirectTo: "/achieve",
      onSuccess: (response, helper) => {
        const { progress: backendProgress } = response as any;
        helper.queryClient.setQueryData(["onboarding-progress"], {
          success: true,
          progress: backendProgress,
        });

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
          const stepCompleted = 3;

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
    const payload = Array.isArray(data.email) ? data.email : [data.email];
    sendInvites.mutate({ invite: payload, workspaceId });
  };

  return {
    control,
    handleSubmit,
    watch,
    onSubmit,
    ...sendInvites,
    reset,
    register,
    formState,
  };
}
