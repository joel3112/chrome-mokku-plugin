import { MethodEnum } from "@mokku/types";

export const getNetworkMethodList = (): (keyof typeof MethodEnum)[] => [
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
];

export const getNetworkMethodMap = () => ({
  GET: null,
  POST: null,
  PATCH: null,
  PUT: null,
  DELETE: null,
});
