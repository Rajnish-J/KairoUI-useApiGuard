import { useEffect, useState } from "react";
import { ApiGuardParams, ApiGuardType } from "../types/api";
import { normalizationStatus } from "../utils/normalizeResponse";

export function useApiGuard<TBody = unknown, TData = unknown>(
  params: ApiGuardParams<TBody, TData>
): ApiGuardType<TData> {
  const { url, method, body, schema, headers } = params;

  const [state, setState] = useState<ApiGuardType<TData>>({
    data: null,
    isValid: false,
    loading: false,
    status: null,
    message: null,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    let isActive = true;

    const run = async () => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        message: null,
      }));

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-type": body != null ? "application/json" : "application/json",
            ...(headers || {}),
          },
          body: body != null && method != "GET" ? JSON.stringify(body) : null,
          signal: controller.signal,
        });

        const status = res.status;
        let raw: unknown = null;

        try{
          raw = await res.json();
        } catch {
          raw = null;
        }

        if (!isActive) return;

        const isSuccess = status >=200 && status < 300;

        let parsed: TData | null = null;

        if (schema && raw != null) {
          const result = schema.safeParse(raw);
          
          if(!result.success){
            setState({
              data: null,
              isValid: false,
              loading: false,
              status,
              message: "Validation Failed",
              error: result.error.issues.map((e: any) => e.message).join(", "),
            });
            return;
          }

          parsed = result.data;
        } 
        else {
          parsed = (raw as TData) ?? null;
        }

        setState({
          data: parsed,
          isValid: isSuccess,
          loading: false,
          status,
          message: normalizationStatus(status, isSuccess),
          error: isSuccess ? null : "Request failed"
        });
      }
      catch (error: any) {
        if(!isActive) return;
        if(error?.name === "AbortError") return;

        setState({
          data: null,
          isValid: false,
          loading: false,
          status: null,
          message: "Network Error",
          error: error?.message ?? "Unknown Errror"
        });
      }
    };

    run();

    return () => {
      isActive = false;
      controller.abort()
    };

  }, [
    url, method, schema, JSON.stringify(body ?? null),
    JSON.stringify(headers ?? null),
  ]);

  return state;
}
