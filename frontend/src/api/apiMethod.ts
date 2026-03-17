export const ApiMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
} as const;

export type ApiMethods = (typeof ApiMethods)[keyof typeof ApiMethods];
