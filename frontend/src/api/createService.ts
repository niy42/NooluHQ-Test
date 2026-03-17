import { ApiMethods } from "./apiMethod";
import { type ApiService } from "./types";

export function createService<Req = unknown, Res = unknown>(
  path: string,
  method: ApiMethods,
): ApiService<Req, Res> {
  return {
    path,
    method,
  };
}
