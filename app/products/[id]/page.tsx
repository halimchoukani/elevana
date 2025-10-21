"use client";
import { notFound, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { ProductReviews } from "@/components/product-reviews";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/ProductsContext";
import { Loading } from "@/components/loading";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = useParams().id as unknown as number;

  const { products, product, loading } = useProducts({ id });

  if (loading) {
    return <Loading />;
  }
  if (!product) {
    return notFound();
  }
  // Get related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Product Details Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Product Gallery */}
              <ProductGallery
                images={product.images}
                productName={product.name}
              />

              {/* Product Info */}
              <ProductInfo product={product} />
            </div>
          </div>
        </section>

        {/* Product Description & Features */}
        <section className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold">
                Description du produit
              </h2>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="mb-4 text-xl font-semibold">
                    Caractéristiques principales
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                          ✓
                        </span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <ProductReviews
                productId={product.id}
                rating={product.rating}
                reviewCount={product.reviews}
              />
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-2xl font-bold">Produits similaires</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
