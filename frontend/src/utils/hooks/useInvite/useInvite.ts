// hooks/useInvite.ts
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationService } from "../Tanstack/useMutationService";
import { inviteServices } from "@/services/invite.services";

type FormValues = {
  email: string[];
};

export function useInvite({ workspaceId }: { workspaceId: string }) {
  const { control, handleSubmit, watch, reset, register, formState } =
    useForm<FormValues>({
      defaultValues: {
        email: [],
      },
    });

  const sendInvites = useMutationService({
    service: inviteServices.sendInvites,
    options: {
      successTitle: "Invites sent!",
      successMessage: "Your teammates have been invited successfully.",
      redirectTo: "/achieve",
      onSuccess: () => {
        reset();
      },
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const payload = Array.isArray(data.email) ? data.email : [data.email];
    sendInvites.mutate({ invite: payload, workspaceId });
  };

  return {
    control,
    formState,
    handleSubmit,
    watch,
    onSubmit,
    ...sendInvites,
    reset,
    register,
  };
}
