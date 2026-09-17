import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

export async function triggerHaptic(
  type: "success" | "error" | "light" | "medium" | "heavy",
) {
  if (!Capacitor.isNativePlatform()) return;

  switch (type) {
    case "success":
      return Haptics.notification({ type: NotificationType.Success });
    case "error":
      return Haptics.notification({ type: NotificationType.Error });
    case "light":
      return Haptics.impact({ style: ImpactStyle.Light });
    case "medium":
      return Haptics.impact({ style: ImpactStyle.Medium });
    case "heavy":
      return Haptics.impact({ style: ImpactStyle.Heavy });
  }
}
