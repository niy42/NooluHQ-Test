import { ApiMethods } from "./apiMethod";

export interface ApiService<Req = unknown, Res = unknown> {
  path: string;
  method: ApiMethods;

  // Used only for TypeScript inference
  __req?: Req;
  __res?: Res;
}
