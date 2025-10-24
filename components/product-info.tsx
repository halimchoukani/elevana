"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  HeartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/db/models";
import { toast } from "sonner";
import { useCart } from "@/lib/CartContext";
import { useProducts } from "@/lib/ProductsContext";
import { useAuth } from "@/lib/AuthContext";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [existInFav, setExistInFav] = useState(false);
  const { addToFav, existInFavList, removeFromFavList } = useProducts();
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast("Ajouté au panier");
  };
  const handleAddToFav = async () => {
    const added = await addToFav(product);
    added
      ? toast.success("Ajouté au favouris")
      : toast.error("Produit deja ajouté");
  };
  const handleRemoveFromFavList = async () => {
    const removed = await removeFromFavList(product);
    removed
      ? toast.success("Produit a été supprimer")
      : toast.error("Produit n'exist pas");
  };
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  useEffect(() => {
    const handleExistInFav = async () => {
      const exist = await existInFavList(product);
      exist ? setExistInFav(true) : setExistInFav(false);
    };
    handleExistInFav();
  }, [product, user]);

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-balance">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.reviews} avis)
            </span>
          </div>
          {product.stock > 0 ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              En stock
            </Badge>
          ) : (
            <Badge variant="destructive">Rupture de stock</Badge>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold">{product.price.toFixed(2)} €</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} €
            </span>
            <Badge variant="destructive">-{discount}%</Badge>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Quantité</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Diminuer la quantité</span>
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Augmenter la quantité</span>
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock} disponibles
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Ajouter au panier
        </Button>
        {isAuthenticated &&
          (!existInFav ? (
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToFav}
              className="cursor-pointer"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Ajouter aux favoris</span>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={handleRemoveFromFavList}
              className="cursor-pointer"
            >
              <Heart fill="black" className="h-5 w-5" />
              <span className="sr-only">Ajouter aux favoris</span>
            </Button>
          ))}

        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            window.navigator.clipboard.writeText(window.location.href);
            toast.success("Lien a été copié avec success");
          }}
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Partager</span>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">Livraison gratuite</p>
            <p className="text-sm text-muted-foreground">
              Pour toute commande supérieure à 50€
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">Garantie 2 ans</p>
            <p className="text-sm text-muted-foreground">
              Retours gratuits sous 30 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
