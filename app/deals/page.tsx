"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/ProductsContext";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/loading";

export default function DealsPage() {
  const { featuredProducts, loading } = useProducts();
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-gradient-to-br from-destructive/10 to-destructive/5 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">Promotions</h1>
              <Badge variant="destructive" className="text-sm">
                Offres limitées
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Profitez de nos meilleures offres et économisez sur vos produits
              préférés
            </p>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {featuredProducts.length} produits en promotion
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
