import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useProducts } from "@/lib/ProductsContext";
import { Product } from "@/db/models";
import Image from "next/image";
import Link from "next/link";

function SearchProducts() {
  const [searchValue, setSearchValue] = useState<string>("");
  const { products } = useProducts();
  const [searchedItems, setSearchedItems] = useState<Product[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSearchedItems(
        products.filter((product) => {
          return product.name
            .toLocaleLowerCase()
            .includes(searchValue.toLowerCase());
        })
      );
    }, 500);
  }, [searchValue]);
  return (
    <div className="hidden flex-1 max-w-md mx-8 md:block">
      <div className="relative">
        <div>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des produits..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
            }}
          />
        </div>
        {searchValue !== "" && (
          <div className="absolute top-[120%] rounded-md bg-white w-full border-primary border-1 p-4 flex flex-col gap-4">
            {searchedItems.length == 0 && <div>Aucun Produit</div>}
            {searchedItems.map((item) => {
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-medium hover:text-primary line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Prix: {item.price.toFixed(2)} €
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;
