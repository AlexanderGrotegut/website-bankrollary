"use client";

import { useIsNative } from "@/hooks/useIsNative";

export function HideOnNative({ children }: { children: React.ReactNode }) {
  const isNative = useIsNative();

  if (isNative) return null;

  return <>{children}</>;
}
