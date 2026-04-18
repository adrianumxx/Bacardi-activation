import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { BacardiMark } from "@/components/brand/bacardi-mark";
import { BacardiWordmarkLockup } from "@/components/brand/bacardi-wordmark-lockup";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/i18n/get-dictionary";
import { getOptionalUser, getProfileForUser } from "@/lib/auth/session";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function ActivationsCatalogLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const nav = dict.portalLayout;
  const L = dict.landing;
  const user = await getOptionalUser();
  const profile = user ? await getProfileForUser(user.id) : null;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/80 bg-card/95 shadow-sm shadow-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href={localizedPath("/activations", locale)}
              className="group flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:gap-2.5"
              aria-label={nav.brandAria}
            >
              <BacardiMark size="sm" className="motion-safe:transition-transform motion-safe:group-hover:scale-[1.04]" />
              <div className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-neutral-300 sm:text-[0.58rem]">
                  {nav.portalEyebrow}
                </span>
                <BacardiWordmarkLockup text={nav.brandName} className="text-lg sm:text-xl" />
              </div>
            </Link>
            <Separator orientation="vertical" className="hidden h-9 sm:block" />
            <nav
              className="hidden min-w-0 items-center gap-2 text-sm text-neutral-300 md:flex md:gap-3"
              aria-label={dict.publicActivations.ariaNav}
            >
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "h-8 whitespace-nowrap border-primary/40 px-2.5 text-xs font-semibold text-foreground no-underline hover:bg-primary/10",
                )}
                href={localizedPath("/activations", locale)}
              >
                {nav.navCatalog}
              </Link>
              {user ? (
                <Link
                  className="rounded-sm whitespace-nowrap font-medium text-neutral-200 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  href={localizedPath("/portal/profile", locale)}
                >
                  {nav.navProfile}
                </Link>
              ) : (
                <Link
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "h-8 whitespace-nowrap px-3 text-xs font-semibold text-primary-foreground no-underline shadow-sm shadow-primary/20",
                  )}
                  href={localizedPath("/login", locale)}
                >
                  {L.navLogin}
                </Link>
              )}
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
            {user ? (
              <>
                <div className="hidden max-w-[200px] text-right text-xs text-muted-foreground lg:block">
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
              </>
            ) : (
              <Link
                href={localizedPath("/login", locale)}
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "min-h-9 md:hidden",
                )}
              >
                {L.navLogin}
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
