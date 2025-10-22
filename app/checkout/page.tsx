"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CreditCard, Truck, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import useOrder from "@/lib/OrderContext";
import ProtectedRoute from "@/lib/ProtectedRoutes";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { confirmOrder } = useOrder();

  const shippingCost =
    totalPrice >= 50 ? 0 : shippingMethod === "express" ? 9.99 : 4.99;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await confirmOrder(items, totalPrice, "");
    clearCart();
    router.push(`/order-confirmation?id=${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />

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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                  {/* Left Column - Forms */}
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informations de contact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!isAuthenticated && (
                          <p className="text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{" "}
                            <Link
                              href="/login"
                              className="font-medium text-primary hover:underline"
                            >
                              Se connecter
                            </Link>
                          </p>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                              id="firstName"
                              defaultValue={user?.firstName}
                              placeholder="Jean"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                              id="lastName"
                              defaultValue={user?.lastName}
                              placeholder="Dupont"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user?.email}
                            placeholder="jean.dupont@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            defaultValue={user?.phone}
                            placeholder="+33 6 12 34 56 78"
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Adresse de livraison</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input
                            id="address"
                            defaultValue={user?.address}
                            placeholder="123 Rue de la Paix"
                            required
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="city">Ville</Label>
                            <Input id="city" placeholder="Paris" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Code postal</Label>
                            <Input
                              id="postalCode"
                              placeholder="75001"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays</Label>
                          <Input id="country" defaultValue="France" required />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping Method */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Mode de livraison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={shippingMethod}
                          onValueChange={setShippingMethod}
                        >
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="standard" id="standard" />
                              <Label
                                htmlFor="standard"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Truck className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">
                                    Livraison standard
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    3-5 jours ouvrés
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-semibold">
                              {totalPrice >= 50 ? "Gratuit" : "4.99 €"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="express" id="express" />
                              <Label
                                htmlFor="express"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">
                                    Livraison express
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    1-2 jours ouvrés
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-semibold">9.99 €</span>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Mode de paiement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <div className="flex items-center gap-3 rounded-lg border p-4">
                            <RadioGroupItem value="card" id="card" />
                            <Label
                              htmlFor="card"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                              <span>Carte bancaire</span>
                            </Label>
                          </div>
                        </RadioGroup>

                        {paymentMethod === "card" && (
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">
                                Numéro de carte
                              </Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="expiry">
                                  Date d'expiration
                                </Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/AA"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" required />
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <Card>
                      <CardHeader>
                        <CardTitle>Récapitulatif de commande</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Items */}
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.product.name} × {item.quantity}
                              </span>
                              <span className="font-medium">
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}{" "}
                                €
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Sous-total
                            </span>
                            <span className="font-medium">
                              {totalPrice.toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Livraison
                            </span>
                            <span className="font-medium">
                              {shippingCost === 0
                                ? "Gratuite"
                                : `${shippingCost.toFixed(2)} €`}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold">
                              {finalTotal.toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" size="lg" className="w-full">
                          Confirmer et payer
                        </Button>

                        {/* Security Notice */}
                        <p className="text-center text-xs text-muted-foreground">
                          Paiement sécurisé. Vos informations sont protégées.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
