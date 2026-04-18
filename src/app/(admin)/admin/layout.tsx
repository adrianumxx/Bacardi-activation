import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-semibold tracking-tight">
              Admin
            </Link>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <nav className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
              <Link className="hover:text-foreground" href="/admin/catalogs">
                Cataloghi
              </Link>
              <Link className="hover:text-foreground" href="/admin/users">
                Inviti
              </Link>
              <Link className="hover:text-foreground" href="/portal">
                Vista cliente
              </Link>
            </nav>
          </div>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
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
