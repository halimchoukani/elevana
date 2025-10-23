"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Trash,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CartItem, Order, Product } from "@/db/models";
import { Loading } from "./loading";
import { useProducts } from "@/lib/ProductsContext";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export function FavorisProducts() {
  const [favItems, setFavItems] = useState<Product[]>([]);
  const { user } = useAuth();
  const { getFavItems, loading, removeFromFavList } = useProducts();
  useEffect(() => {
    const fetchFavs = async () => {
      const favItems = await getFavItems();
      if (favItems) {
        setFavItems(favItems);
      }
    };
    fetchFavs();
  }, [user]);
  const handleRemoveItem = async (p: Product) => {
    const isRemoved = await removeFromFavList(p);
    isRemoved
      ? toast.success("Produit a été supprimé")
      : toast.error("erreur de suppression");
  };
  if (loading) {
    return <Loading />;
  }
  if (!loading && favItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Aucune Produit</h3>
          <p className="mb-6 text-muted-foreground">
            Vous n'avez pas encore ajouté produit au favoris
          </p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produit Favoris</h2>
        <p className="text-sm text-muted-foreground">
          {favItems.length} Produits
        </p>
      </div>

      {favItems.map((item) => {
        return (
          <Card key={item.id}>
            <CardContent className="space-y-4">
              <div className="space-y-3">
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
                      Quantité: {item.stock}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prix : {item.price.toFixed(2)} €
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await handleRemoveItem(item);
                    }}
                    className="flex items-center justify-center text-destructive hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
