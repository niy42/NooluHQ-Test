import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { client } from "@/api/client";
import { useAppDispatch } from "@/redux/store/hooks";
import {
  type CombinedReducerType,
  type AuthReduxState,
} from "@/redux/store/types";
import { type ApiService } from "@/api/types";

type MutationContext = { previousData?: any; queryKey?: string[] };

type MutationSuccessHandler<Res, Req> = (
  response: Res,
  helpers: {
    queryClient: ReturnType<typeof useQueryClient>;
    navigate: ReturnType<typeof useNavigate>;
    dispatch: ReturnType<typeof useAppDispatch>;
    variables: Req;
  },
) => void;

type MutationErrorHandler = (
  error: unknown,
  helpers: {
    enqueueSnackbar: ReturnType<typeof useSnackbar>["enqueueSnackbar"];
  },
) => void;

// Helper types
type ServiceObject<Service extends ApiService> = Service;
type ServiceFn<Service extends ApiService> = (
  variables: Service["__req"],
) => Service;

export interface UseMutationServiceProps<Service extends ApiService> {
  service: ServiceObject<Service> | ServiceFn<Service>;
  options?: {
    keys?: string[];
    invalidateKeys?: string[];
    isDownload?: boolean;
    isPdf?: boolean;
    canShare?: boolean;
    fileName?: string;
    isFormData?: boolean;
    suppressToast?: boolean;
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    redirectTo?: string;
    redirectState?: Record<string, any>;
    onSuccess?: MutationSuccessHandler<Service["__res"], Service["__req"]>;
    onError?: MutationErrorHandler;
    optimisticUpdate?: {
      queryKey: string[];
      updateFn: (oldData: any, variables: Service["__req"]) => any;
    };
  };
}

export function useMutationService<Service extends ApiService>(
  props: UseMutationServiceProps<Service>,
): UseMutationResult<
  Service["__res"],
  unknown,
  Service["__req"],
  MutationContext
> {
  const { options = {} } = props;
  const {
    keys = [],
    invalidateKeys,
    isDownload,
    isPdf,
    canShare,
    fileName,
    isFormData,
    suppressToast = false,
    onSuccess,
    onError,
    successTitle,
    successMessage,
    errorTitle,
    redirectTo,
    redirectState,
    optimisticUpdate,
    ...rest
  } = options;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const { refreshToken, accessToken } =
    useSelector<CombinedReducerType, AuthReduxState>(
      ({ authentication }) => authentication,
    ) || {};

  return useMutation<
    Service["__res"],
    unknown,
    Service["__req"],
    MutationContext
  >({
    ...rest,
    mutationKey: [
      ...keys,
      typeof props.service === "function"
        ? props.service.name || "serviceFn"
        : props.service.path,
      refreshToken?._time_stamp,
      accessToken?._time_stamp,
    ],
    mutationFn: async (variables: Service["__req"]) => {
      const resolvedService =
        typeof props.service === "function"
          ? props.service(variables)
          : props.service;

      return client.request<Service["__req"], Service["__res"]>({
        ...resolvedService,
        method: resolvedService.method ?? "POST",
        data: variables,
        options: { isFormData, isDownload, isPdf, canShare, fileName },
      });
    },

    onMutate: async (variables: Service["__req"]) => {
      if (!optimisticUpdate)
        return { previousData: undefined, queryKey: undefined };
      const { queryKey, updateFn } = optimisticUpdate;

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData: any) =>
        updateFn(oldData, variables),
      );

      return { previousData, queryKey };
    },

    onSuccess: async (response, variables, _context) => {
      if (onSuccess) {
        onSuccess(response, { queryClient, navigate, dispatch, variables });
      }

      if (invalidateKeys?.length) {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        );
      }

      if (!suppressToast) {
        const title = successTitle || "Success";
        const description =
          successMessage ||
          (response as { message?: string })?.message ||
          "Operation completed.";
        enqueueSnackbar(`${title}: ${description}`, { variant: "success" });
      }

      if (redirectTo) {
        navigate(redirectTo, {
          state: redirectState || undefined,
        });
      }
      if (isDownload && fileName) {
        const blob = response as unknown as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    },

    onError: (error: unknown, _variables, context) => {
      if (context?.previousData && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }

      const status = (error as any)?.response?.status;
      if (status === 413) {
        enqueueSnackbar(
          "The file is too large. Please upload a smaller file.",
          { variant: "error" },
        );
        return;
      }

      if (onError) {
        onError(error, { enqueueSnackbar });
      } else {
        const message =
          (error as any)?.message ||
          (error as any)?.error ||
          "Something went wrong.";
        enqueueSnackbar(`${errorTitle || "Operation Failed"}: ${message}`, {
          variant: "error",
        });
      }
    },
  });
}
