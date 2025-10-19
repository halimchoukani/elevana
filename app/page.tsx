"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  CreditCard,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Loading } from "@/components/loading";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsContext } from "@/lib/ProductsContext";
import { ProductCard } from "@/components/product-card";
export default function HomePage() {
  const { loading } = useAuth();
  const {
    categories,
    loading: loadingProducts,
    featuredProducts,
    products,
  } = ProductsContext();
  if (loading || loadingProducts) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                  Découvrez nos produits d'exception
                </h1>
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                  Des milliers de produits de qualité à des prix imbattables.
                  Livraison rapide et service client exceptionnel.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/products">
                      Voir les produits
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/deals">Voir les promotions</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
                <Image
                  src="/hero.png"
                  alt="Shopping"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Livraison gratuite</h3>
                  <p className="text-sm text-muted-foreground">
                    Pour toute commande supérieure à 50€
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Paiement sécurisé</h3>
                  <p className="text-sm text-muted-foreground">
                    Vos données sont protégées
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Retours faciles</h3>
                  <p className="text-sm text-muted-foreground">
                    30 jours pour changer d'avis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Support 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Notre équipe est là pour vous
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Explorez nos catégories
              </h2>
              <p className="text-lg text-muted-foreground">
                Trouvez exactement ce que vous cherchez
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="mb-1 text-xl font-bold">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/90">
                            {category.productCount} produits
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Promotions du moment
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ne manquez pas nos meilleures offres
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="hidden md:flex bg-transparent"
              >
                <Link href="/deals">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/deals">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/*<Card className="overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                  <div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-balance">
                      Inscrivez-vous à notre newsletter
                    </h2>
                    <p className="mb-6 text-lg text-primary-foreground/90 leading-relaxed">
                      Recevez nos offres exclusives et soyez les premiers
                      informés de nos nouveautés
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="flex h-11 flex-1 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60"
                      />
                      <Button
                        size="lg"
                        variant="secondary"
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      >
                        S'inscrire
                      </Button>
                    </div>
                  </div>
                  <div className="relative aspect-square lg:aspect-auto lg:h-[300px]">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Newsletter"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>*/}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
