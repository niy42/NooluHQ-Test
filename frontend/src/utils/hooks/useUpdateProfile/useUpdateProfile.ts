import { useMutationService } from "../Tanstack/useMutationService";
import { userProfileServices } from "@/services/userProfile.services";

export const useUpdateProfile = () => {
  return useMutationService({
    service: userProfileServices.userProfile,
    options: {
      optimisticUpdate: {
        queryKey: ["profile"],
        updateFn: (oldData, variables: any) => ({
          ...oldData,
          ...variables,
        }),
      },
      successTitle: "Profile Updated",
      successMessage: "Your profile has been updated successfully.",
      invalidateKeys: ["profile"],
    },
  });
};
