import { AuthPage } from "@/components/auth/AuthPage";
import { noIndexMetadata } from "@/lib/noIndexMetadata";

export const metadata = noIndexMetadata;

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
