"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, Category } from "@/db/models";
export function ProductFilters({
  categories,
  filteredProducts,
  setFilteredProducts,
}: {
  categories: Category[];
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
}) {
  const maxPrice = filteredProducts.reduce(
    (max, p) => Math.max(max, p.price),
    0
  );
  if (maxPrice === 0) {
    return <div>Aucun produit disponible pour le filtrage.</div>;
  }
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  useEffect(() => {
    const newFilteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    setFilteredProducts(newFilteredProducts);
  }, [priceRange, filteredProducts]);
  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={maxPrice}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{priceRange[0]} €</span>
            <span className="text-muted-foreground">{priceRange[1]} €</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catégories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={`category-${category.id}`} />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Note minimum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm font-normal cursor-pointer"
              >
                {rating} étoiles et plus
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disponibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" />
            <Label
              htmlFor="in-stock"
              className="text-sm font-normal cursor-pointer"
            >
              En stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="on-sale" />
            <Label
              htmlFor="on-sale"
              className="text-sm font-normal cursor-pointer"
            >
              En promotion
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button variant="outline" className="w-full bg-transparent">
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
