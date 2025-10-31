"use client";

import type React from "react";

import { Footer } from "@/components/footer";
import { loadStripe } from "@stripe/stripe-js";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormContent from "@/components/checkout-form-content";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/50">
        {/* Page Header */}
        <section className="border-b bg-background py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Finaliser la commande
            </h1>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Elements stripe={stripePromise}>
              <CheckoutFormContent />
            </Elements>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
