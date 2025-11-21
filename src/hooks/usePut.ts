// src/hooks/usePut.ts
import { ZodType } from "zod";
import { ApiGuardType } from "../types/api";
import { useApiGuard } from "../core/useApiGuard";

export function usePut<TBody = unknown, TData = unknown>(
  url: string,
  body: TBody,
  schema?: ZodType<TData>,
  headers?: Record<string, string>
): ApiGuardType<TData> {
  return useApiGuard<TBody, TData>({
    url,
    method: "PUT",
    body,
    ...(schema ? { schema } : {}),
    ...(headers ? { headers } : {}),
  });
}
