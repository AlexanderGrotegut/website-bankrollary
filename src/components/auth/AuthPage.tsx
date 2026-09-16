import { BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

export function AuthPage({
  mode,
}: {
  mode: "login" | "register" | "forgot" | "reset";
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="auth-hero hidden lg:flex">
        <div className="max-w-xl">
          <p className="eyebrow">Dein Spiel. Deine Statistik.</p>
          <h2 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-tight">
            Klarheit über jede Session und jeden Euro.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">
            Verfolge Ergebnisse, erkenne Trends und triff Entscheidungen auf
            Basis deiner echten Zahlen.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              [BarChart3, "Klare Trends"],
              [Clock3, "Zeit im Blick"],
              [ShieldCheck, "Private Daten"],
            ].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof BarChart3;
              return (
                <div className="auth-feature" key={label as string}>
                  <FeatureIcon size={20} />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <AuthForm mode={mode} />
      </section>
    </main>
  );
}
