import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/auth/session";
import { BacardiMark } from "@/components/brand/bacardi-mark";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/i18n/get-dictionary";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const nav = dict.adminNav;
  const portalNav = dict.portalLayout;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/80 bg-card/95 shadow-sm shadow-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href={localizedPath("/admin", locale)}
              className="group flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label={nav.brandAria}
            >
              <BacardiMark size="sm" />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-neutral-300 transition-colors group-hover:text-neutral-100">
                  {nav.eyebrow}
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-tight text-foreground sm:text-2xl">
                  {nav.title}
                </span>
              </div>
            </Link>
            <Separator orientation="vertical" className="hidden h-9 sm:block" />
            <nav
              className="hidden items-center gap-3 text-sm text-neutral-300 sm:flex"
              aria-label="Sezioni admin"
            >
              <Link
                className="rounded-sm font-medium text-neutral-200 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={localizedPath("/admin/catalogs", locale)}
              >
                {nav.catalogs}
              </Link>
              <Link
                className="rounded-sm font-medium text-neutral-200 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={localizedPath("/admin/users", locale)}
              >
                {nav.invites}
              </Link>
              <Link
                className="rounded-sm font-medium text-neutral-200 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={localizedPath("/activations", locale)}
              >
                {nav.clientView}
              </Link>
              <a
                href={DEFAULT_BOOKINGS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "h-8 gap-1 border-primary/35 px-2.5 text-xs font-medium text-foreground no-underline hover:bg-primary/10",
                )}
                aria-label={portalNav.bookingsAria}
              >
                {portalNav.navBookings}
                <ExternalLink className="size-3 opacity-90" aria-hidden />
              </a>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LocaleDashSwitcher locale={locale} copy={dict.localeSwitcher} variant="compact" />
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "min-h-9 shrink-0",
              })}
              href={localizedPath("/activations", locale)}
            >
              {nav.exit}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
