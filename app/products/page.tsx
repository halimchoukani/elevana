"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { useProducts } from "@/lib/ProductsContext";
import { Loading } from "@/components/loading";
import { useEffect, useRef, useState } from "react";

export default function ProductsPage() {
  const { products, loading: productsLoading, categories } = useProducts();
  const sortOptionSelect = useRef(null);

  const [filteredProducts, setFilteredProducts] = useState(products);
  useEffect(() => {
    setFilteredProducts(products || []);
  }, []);
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedProducts = [...filteredProducts];
    switch (event.target.value) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
    setFilteredProducts(sortedProducts);
  };
  if (productsLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Tous les produits
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez notre sélection complète de produits de qualité
            </p>
          </div>
        </section>

        {/* Products Grid with Filters */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* Filters Sidebar */}
              <aside className="hidden lg:block">
                <ProductFilters
                  categories={categories}
                  products={products}
                  onFilterChange={setFilteredProducts}
                />
              </aside>

              {/* Products Grid */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} produits trouvés
                  </p>
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    ref={sortOptionSelect}
                    onChange={handleSort}
                  >
                    <option value="" selected disabled>
                      Trier par
                    </option>
                    <option value="price-asc">Prix: Croissant</option>
                    <option value="price-desc">Prix: Décroissant</option>
                    <option value="rating">Meilleures notes</option>
                    <option value="newest">Nouveautés</option>
                  </select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
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
