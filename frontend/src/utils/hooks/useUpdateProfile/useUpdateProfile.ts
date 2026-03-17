import { authServices } from "@/services/auth.services";
import { useMutationService } from "./useMutationService";

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  city?: string;
}

interface UpdateProfileResponse {
  user: any;
  message: string;
}

export const useUpdateProfile = () => {
  return useMutationService<UpdateProfileRequest, UpdateProfileResponse>({
    service: authServices.userProfile,
    options: {
      optimisticUpdate: {
        queryKey: ["profile"],
        updateFn: (oldData, variables) => ({
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
