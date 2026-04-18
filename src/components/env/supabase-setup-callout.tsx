import type { ReactNode } from "react";
import { Database } from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { SupabaseEnvIssueKind } from "@/lib/env";
import { cn } from "@/lib/utils";

type EnvCopy = Dictionary["supabaseEnv"];

function issueLines(issues: EnvCopy["issues"], kinds: readonly SupabaseEnvIssueKind[]): string[] {
  return kinds.map((k) => issues[k]);
}

/** Pannello setup Supabase on-brand (non “errore”), con elenco problemi tradotti. */
export function SupabaseSetupCallout({
  env,
  kinds,
  className,
  children,
}: {
  env: EnvCopy;
  kinds: readonly SupabaseEnvIssueKind[];
  className?: string;
  children?: ReactNode;
}) {
  const lines = issueLines(env.issues, kinds);

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card/40 to-card/90 p-4 shadow-[0_20px_50px_-28px_rgba(217,30,39,0.35)] ring-1 ring-white/[0.05] sm:p-5",
        className,
      )}
    >
      <div className="flex gap-3.5">
        <div
          className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20"
          aria-hidden
        >
          <Database className="size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="font-display text-base font-bold uppercase tracking-tight text-foreground">{env.setupTitle}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{env.setupLead}</p>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
            {lines.map((line) => (
              <li key={line} className="flex gap-2.5">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/80" aria-hidden />
                <span className="min-w-0">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children ? <div className="mt-4 border-t border-white/[0.06] pt-4">{children}</div> : null}
    </div>
  );
}
