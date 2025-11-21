import { ZodType } from "zod";
import { ApiGuardType } from "../types/api";
import { useApiGuard } from "../core/useApiGuard";

export function useGet<TData = unknown>(
  url: string,
  schema?: ZodType<TData>,
  headers?: Record<string, string>
): ApiGuardType<TData> {
  return useApiGuard<void, TData>({
    url,
    method: "GET",
    ...(schema ? { schema } : {}),
    ...(headers ? { headers } : {}),
  });
}
