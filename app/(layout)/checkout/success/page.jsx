"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container rounded-3xl p-8 text-center shadow-lg">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="material-symbols:check-circle" className="text-5xl" />
        </div>
        <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
        <p className="text-on-surface-variant mb-6">
          Thank you for choosing EmirAir. Your ticket has been booked successfully.
        </p>
        
        {ticketId && (
          <div className="bg-surface-container-highest rounded-xl p-4 mb-8">
            <p className="text-sm text-on-surface-variant mb-1">Your Ticket ID</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{ticketId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-primary/90 transition shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
