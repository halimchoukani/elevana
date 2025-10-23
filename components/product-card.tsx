"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/db/models";
import { useCart } from "@/lib/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast("Ajouté au panier");
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {discount > 0 && (
              <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground text-white">
                -{discount}%
              </Badge>
            )}
          </div>
          <div className="p-4">
            <h3 className="mb-2 font-semibold text-balance line-clamp-2 group-hover:text-primary">
              {product.name}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
