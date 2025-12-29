"use client";

import { useRef, useState } from "react";

type FormState<T> = Partial<T>;

export function useSmartForm<T extends Record<string, any>>() {
  const valuesRef = useRef<FormState<T>>({});
  const [, forceRender] = useState(0);
  const [loading, setLoading] = useState(false);

  function register<K extends keyof T>(name: K) {
    return {
      name,
      value: (valuesRef.current[name] ?? "") as T[K],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        valuesRef.current[name] = e.target.value as T[K];
        forceRender((v) => v + 1);
      },
    };
  }

  async function submit(callback: (data: T) => Promise<void> | void) {
    try {
      setLoading(true);
      await callback(valuesRef.current as T);
    } finally {
      setLoading(false);
    }
  }

  function getValues(): T {
    return valuesRef.current as T;
  }

  function reset() {
    valuesRef.current = {};
    forceRender((v) => v + 1);
  }

  return {
    register,
    submit,
    getValues,
    reset,
    loading,
  };
}
