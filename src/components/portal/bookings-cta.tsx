"use client";

import { useState } from "react";
import { toast } from "sonner";

import { logBookingClick } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";

export function BookingsCta({
  activationId,
  disabled,
}: {
  activationId: string;
  disabled: boolean;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      disabled={disabled || loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await logBookingClick(activationId);
          if (!res.ok) {
            toast.error(res.error);
            return;
          }
          toast.success("Apri Outlook per completare la prenotazione.");
          window.open(res.url, "_blank", "noopener,noreferrer");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Apertura…" : "Prenota su Microsoft Bookings"}
    </Button>
  );
}
