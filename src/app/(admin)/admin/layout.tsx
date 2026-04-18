import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/auth/session";
import { BacardiMark } from "@/components/brand/bacardi-mark";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/80 bg-card/95 shadow-sm shadow-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href="/admin"
              className="group flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label="Bacardi — area amministrazione"
            >
              <BacardiMark size="sm" />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
                  Bacardi
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-tight text-foreground sm:text-2xl">
                  Admin
                </span>
              </div>
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
              <a
                href={DEFAULT_BOOKINGS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 gap-1 border-primary/40 px-2.5 text-xs font-semibold text-foreground hover:bg-primary/10",
                )}
              >
                Bookings
                <ExternalLink className="size-3 opacity-80" aria-hidden />
              </a>
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
