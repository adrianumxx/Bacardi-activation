import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { instrumentDisplay } from "@/lib/fonts/instrument-display";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className={cn(instrumentDisplay.variable, "min-h-dvh")}>
      <header className="border-b border-border/80 bg-card/95 shadow-sm shadow-foreground/[0.03] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin"
              className="group flex shrink-0 flex-col gap-0.5 rounded-md leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label="Bacardi — area amministrazione"
            >
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
                Bacardi
              </span>
              <span className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
                Admin
              </span>
            </Link>
            <Separator orientation="vertical" className="hidden h-9 sm:block" />
            <nav
              className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex"
              aria-label="Sezioni admin"
            >
              <Link
                className="rounded-sm transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href="/admin/catalogs"
              >
                Cataloghi
              </Link>
              <Link
                className="rounded-sm transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href="/admin/users"
              >
                Inviti
              </Link>
              <Link
                className="rounded-sm transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href="/portal"
              >
                Vista cliente
              </Link>
            </nav>
          </div>
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "min-h-9 shrink-0",
            })}
            href="/portal"
          >
            Esci admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
