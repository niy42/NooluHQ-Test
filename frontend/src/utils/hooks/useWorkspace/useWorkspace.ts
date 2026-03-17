// hooks/useWorkspace.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { workspaceServices } from "@/services/workspace.services";

type FormValues = {
  workspace: string;
};

export function useWorkspace() {
  const { control, handleSubmit, watch, reset, register } = useForm<FormValues>(
    {
      defaultValues: {
        workspace: "",
      },
    },
  );

  const createdWorkspace = useMutationService({
    service: workspaceServices.createWorkspace,
    options: {
      successTitle: "Great job!",
      successMessage: "Your workspace is live!",
      onSuccess: (response: any, helpers) => {
        const workspaceId = response?.workspace.id;
        helpers.navigate(`/invite-team?workspace-id=${workspaceId}`);
        reset();
      },
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createdWorkspace.mutate(data);
  };

  return {
    control,
    handleSubmit,
    watch,
    onSubmit,
    ...createdWorkspace,
    reset,
    register,
  };
}
