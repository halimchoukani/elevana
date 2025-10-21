"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Product } from "@/db/models";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function ProductFilters({
  categories,
  products,
  onFilterChange,
}: {
  categories: Category[];
  products: Product[];
  onFilterChange: (filtered: Product[]) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const maxPrice = products.reduce(
    (max, product) => (product.price > max ? product.price : max),
    0
  );
  const pathName = usePathname();
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  useEffect(() => {
    if (category) {
      const cat = categories.find(
        (c) => c.id.toLowerCase() === category.toLowerCase()
      );

      if (cat && !selectedCategories.includes(cat.id as unknown as number)) {
        setSelectedCategories([
          ...selectedCategories,
          cat.id as unknown as number,
        ]);
      } else {
        pathName.replace("category", "");
      }
    } else {
      setSelectedCategories([]);
    }
  }, [category, categories]);
  useEffect(() => {
    let filtered: Product[] = products;

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category as unknown as number)
      );
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.some((rating) => product.rating >= rating)
      );
    }

    if (inStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    if (onSale) {
      filtered = filtered.filter(
        (product) =>
          (product.originalPrice as unknown as number) > product.price
      );
    }

    onFilterChange(filtered);
  }, [
    priceRange,
    selectedCategories,
    selectedRatings,
    inStock,
    onSale,
    products,
    onFilterChange,
  ]);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    router.replace("/products", { scroll: false });
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    setSelectedRatings((prev) =>
      checked ? [...prev, rating] : prev.filter((r) => r !== rating)
    );
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSelectedRatings([]);
    setInStock(false);
    setOnSale(false);
  };

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
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(
                  category.id as unknown as number
                )}
                onCheckedChange={(checked) =>
                  handleCategoryChange(
                    category.id as unknown as number,
                    checked as boolean
                  )
                }
              />
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
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) =>
                  handleRatingChange(rating, checked as boolean)
                }
              />
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
            <Checkbox
              id="in-stock"
              checked={inStock}
              onCheckedChange={(checked) => setInStock(checked as boolean)}
            />
            <Label
              htmlFor="in-stock"
              className="text-sm font-normal cursor-pointer"
            >
              En stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={onSale}
              onCheckedChange={(checked) => setOnSale(checked as boolean)}
            />
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
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleReset}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
