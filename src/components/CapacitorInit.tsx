"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";

function initializeNativePlugins() {
  if (!Capacitor.isNativePlatform()) return;

  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: "#0a0a0a" }).catch(() => {});

  if (Capacitor.getPlatform() === "ios") {
    Keyboard.setResizeMode({ mode: KeyboardResize.Body }).catch(() => {});
    Keyboard.setScroll({ isDisabled: false }).catch(() => {});
  }

  SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
}

export function CapacitorInit() {
  useEffect(() => {
    initializeNativePlugins();
  }, []);

  return null;
}
