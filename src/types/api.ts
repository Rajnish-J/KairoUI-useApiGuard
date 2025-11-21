import type { ZodType } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiGuardParams<TBody = unknown, TData = unknown> {
  url: string;
  method: HttpMethod;
  body?: TBody;
  schema?: ZodType<TData>;
  headers?: Record<string, string>;
}

export interface ApiGuardType<TData = unknown> {
  data: TData | null;
  isValid: boolean;
  loading: boolean;
  status: number | null;
  message: string | null;
  error: string | null;
}
