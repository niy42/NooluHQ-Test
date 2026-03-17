// hooks/useWhoIsJoining.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { onboardingServices } from "@/services/onboarding.services";
import { setOnboardingProgress } from "@/redux/store/slices/authSlice";

type FormValues = {
  name: string;
  role: string;
  teamSize: string;
};

export function useWhoIsJoining() {
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
      onSuccess: (response, helpers) => {
        const { queryClient, dispatch } = helpers;
        const { progress } = response as any;
        console.log("Progress after who is joining: ", progress);
        dispatch(setOnboardingProgress(progress));
        queryClient.setQueryData(["onboarding-progress"], {
          success: true,
          progress,
        });
        reset();
      },
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
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
