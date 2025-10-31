import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import useOrder from "@/lib/OrderContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { CreditCard, Package, Truck } from "lucide-react";
import { Button } from "./ui/button";
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#111827",
      fontSize: "16px",
      fontFamily: "Inter, Roboto, sans-serif",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};
export default function CheckoutFormContent() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { confirmOrder } = useOrder();
  const stripe = useStripe();
  const elements = useElements();
  const shippingCost =
    totalPrice >= 50 ? 0 : shippingMethod === "express" ? 9.99 : 4.99;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let paymentToken = "";

    if (paymentMethod === "card") {
      if (!stripe || !elements) {
        alert("Stripe n'est pas encore chargé. Réessayez dans un instant.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        alert("Element de carte introuvable.");
        return;
      }

      const result = await stripe.createToken(cardElement);
      if (result.error) {
        alert(
          result.error.message ||
            "Erreur lors de la création du token de paiement."
        );
        return;
      }

      paymentToken = result.token?.id || "";
    }

    try {
      const id = await confirmOrder(items, totalPrice, paymentToken);
      clearCart();
      router.push(`/order-confirmation?id=${id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la commande.");
    }
  };

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
                          <Input id="city" placeholder="Tunis" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Code postal</Label>
                          <Input id="postalCode" placeholder="75001" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input id="country" defaultValue="Tunisie" required />
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
                                <p className="font-medium">Livraison express</p>
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
                            <span>Carte bancaire (Stripe)</span>
                          </Label>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border p-4">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <span>Paiement à la livraison</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "card" && (
                        <div className="space-y-4 pt-4">
                          <Label>Informations de carte</Label>
                          <div className="rounded-md border p-3">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
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
                              {(item.product.price * item.quantity).toFixed(2)}{" "}
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
    </div>
  );
}
