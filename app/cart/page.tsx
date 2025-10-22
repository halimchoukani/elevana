"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-md text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h1 className="mb-4 text-2xl font-bold">Votre panier est vide</h1>
              <p className="mb-8 text-muted-foreground">
                Découvrez notre sélection de produits et ajoutez vos articles
                préférés
              </p>
              <Button size="lg" asChild>
                <Link href="/products">
                  Découvrir nos produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-muted/50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Panier ({totalItems})
            </h1>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Cart Items */}
              <div className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Articles ({items.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    Vider le panier
                  </Button>
                </div>

                {items.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.product.id}`}
                          className="shrink-0"
                        >
                          <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-semibold hover:text-primary line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.product.category}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center rounded-lg border">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">Diminuer</span>
                              </Button>
                              <span className="w-10 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Augmenter</span>
                              </Button>
                            </div>

                            {/* Price & Remove */}
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold">
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}{" "}
                                €
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-xl font-semibold">
                      Récapitulatif
                    </h2>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span className="font-medium">
                          {totalPrice.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="font-medium">
                          {totalPrice >= 50 ? "Gratuite" : "4.99 €"}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">
                          {(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(
                            2
                          )}{" "}
                          €
                        </span>
                      </div>
                    </div>

                    {/* Free Shipping Notice */}
                    {totalPrice < 50 && (
                      <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                        <p className="text-muted-foreground">
                          Ajoutez{" "}
                          <span className="font-semibold text-foreground">
                            {(50 - totalPrice).toFixed(2)} €
                          </span>{" "}
                          pour bénéficier de la livraison gratuite
                        </p>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <Button size="lg" className="mt-6 w-full" asChild>
                      <Link href="/checkout">
                        Passer la commande
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    {/* Continue Shopping */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="mt-3 w-full bg-transparent"
                      asChild
                    >
                      <Link href="/products">Continuer mes achats</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Livraison gratuite dès 50€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Retours gratuits sous 30 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
