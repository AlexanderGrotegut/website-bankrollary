"use client";

import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return Capacitor.isNativePlatform();
}

function getServerSnapshot() {
  return false;
}

export function useIsNative() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
