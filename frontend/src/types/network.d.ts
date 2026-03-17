interface UseQueryServiceProps<Req, Resp> {
  service: ServiceInterface<Req, Resp>;
  requestPayload?: Req;
  options?: Omit<
    UseQueryOptions<Resp, Error, Resp, QueryKey>,
    "queryKey" | "queryFn"
  > & {
    keys?: string[] | Array<string | number> | unknown[];
    enabled?: boolean;
    isDownload?: boolean;
    canShare?: boolean;
    fileName?: string;
    isPdf?: boolean;
  };
}
