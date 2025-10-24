"use client";

import Link from "next/link";
import { CheckCircle, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("id") || "";
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="mb-4 text-3xl font-bold">Commande confirmée !</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Merci pour votre commande. Nous avons bien reçu votre paiement et
              votre commande est en cours de préparation.
            </p>

            {/* Order Number */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  Numéro de commande
                </p>
                <p className="text-2xl font-bold">
                  {orderNumber ?? "Génération en cours..."}
                </p>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="mb-8 space-y-4 text-left">
              <h2 className="text-xl font-semibold">Prochaines étapes</h2>
              <div className="space-y-3">
                <div className="flex gap-4 rounded-lg border p-4">
                  <Mail className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Confirmation par email</p>
                    <p className="text-sm text-muted-foreground">
                      Vous allez recevoir un email de confirmation avec les
                      détails de votre commande
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-lg border p-4">
                  <Package className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Préparation de la commande</p>
                    <p className="text-sm text-muted-foreground">
                      Votre commande sera préparée et expédiée dans les 24-48
                      heures
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/products">Continuer mes achats</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/profile">Voir mes commandes</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
