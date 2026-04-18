import Image from "next/image";

import { cn } from "@/lib/utils";

const BOLLINO_SRC = "/brand/bacardi-bollino.svg";

const dimMap = { sm: 40, md: 52, lg: 72 } as const;

/**
 * Bollino BACARDÍ (SVG vettoriale, fondo trasparente fuori dal tondo).
 * Sostituisci `public/brand/bacardi-bollino.svg` con il file ufficiale dal brand center se richiesto.
 */
export function BacardiMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = dimMap[size];
  return (
    <Image
      src={BOLLINO_SRC}
      width={dim}
      height={dim}
      alt=""
      unoptimized
      priority={false}
      className={cn("shrink-0 select-none object-contain", className)}
      aria-hidden
    />
  );
}
