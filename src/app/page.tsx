import { redirect } from "next/navigation";

import { getOptionalUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getOptionalUser();
  if (user) redirect("/portal");
  redirect("/login");
}
