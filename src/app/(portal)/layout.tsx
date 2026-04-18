import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { requireUser, getProfileForUser } from "@/lib/auth/session";

export default async function PortalShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfileForUser(user.id);

  return (
    <div className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/portal" className="font-semibold tracking-tight">
              Attivazioni Bacardi
            </Link>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <nav className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
              <Link className="hover:text-foreground" href="/portal">
                Catalogo
              </Link>
              <Link className="hover:text-foreground" href="/portal/profile">
                Profilo
              </Link>
              {profile?.role === "admin" ? (
                <Link className="hover:text-foreground" href="/admin">
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <div className="font-medium text-foreground">
                {profile?.company_name?.trim() || "Cliente"}
              </div>
              <div>{user.email}</div>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Esci
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
