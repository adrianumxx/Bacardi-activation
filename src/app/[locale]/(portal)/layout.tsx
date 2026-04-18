import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { BacardiMark } from "@/components/brand/bacardi-mark";
import { BacardiWordmarkLockup } from "@/components/brand/bacardi-wordmark-lockup";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/i18n/get-dictionary";
import { requireUser, getProfileForUser } from "@/lib/auth/session";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function PortalShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const nav = dict.portalLayout;
  const user = await requireUser();
  const profile = await getProfileForUser(user.id);

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/80 bg-card/95 shadow-sm shadow-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href={localizedPath("/portal", locale)}
              className="group flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:gap-2.5"
              aria-label={nav.brandAria}
            >
              <BacardiMark size="sm" className="motion-safe:transition-transform motion-safe:group-hover:scale-[1.04]" />
              <div className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.58rem]">
                  {nav.portalEyebrow}
                </span>
                <BacardiWordmarkLockup text={nav.brandName} className="text-lg sm:text-xl" />
              </div>
            </Link>
            <Separator orientation="vertical" className="hidden h-9 sm:block" />
            <nav
              className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground md:flex md:gap-3"
              aria-label="Sezioni portale"
            >
              <Link
                className="rounded-sm whitespace-nowrap transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={localizedPath("/portal", locale)}
              >
                {nav.navCatalog}
              </Link>
              <Link
                className="rounded-sm whitespace-nowrap transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={localizedPath("/portal/profile", locale)}
              >
                {nav.navProfile}
              </Link>
              <a
                href={DEFAULT_BOOKINGS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nav.bookingsAria}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 gap-1 border-primary/40 px-2.5 text-xs font-semibold text-foreground hover:bg-primary/10",
                )}
              >
                {nav.navBookings}
                <ExternalLink className="size-3 opacity-80" aria-hidden />
              </a>
              {profile?.role === "admin" ? (
                <Link
                  className="rounded-sm whitespace-nowrap transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  href={localizedPath("/admin", locale)}
                >
                  {nav.navAdmin}
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LocaleDashSwitcher locale={locale} copy={dict.localeSwitcher} variant="compact" />
            <a
              href={DEFAULT_BOOKINGS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "min-h-9 border-primary/40 px-2.5 md:hidden",
              )}
              aria-label={nav.bookingsAria}
            >
              <ExternalLink className="size-4" />
            </a>
            <div className="hidden max-w-[220px] text-right text-xs text-muted-foreground lg:block">
              <div className="truncate font-medium text-foreground">
                {profile?.company_name?.trim() || nav.fallbackClientName}
              </div>
              <div className="truncate">{user.email}</div>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="min-h-9">
                {nav.signOut}
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
