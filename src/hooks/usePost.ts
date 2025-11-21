import { ur } from "zod/v4/locales";
import { ZodType } from "zod";
import { ApiGuardType } from "../types/api";
import { useApiGuard } from "../core/useApiGuard";

export function usePost<TBody = unknown, TData = unknown>(
  url: string,
  body: TBody,
  schema?: ZodType<TData>,
  headers?: Record<string, string>
): ApiGuardType<TData> {
  return useApiGuard<TBody, TData>({
    url,
    method: "POST",
    body,
    ...(schema ? { schema } : {}),
    ...(headers ? { headers } : {}),
  });
}
