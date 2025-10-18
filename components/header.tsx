"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { useCart } from "@/lib/cart-context";
//import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";
import { Loading } from "./loading";

export function Header() {
  //const { totalItems } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const totalItems = 2;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                E
              </span>
            </div>
            <span className="text-xl font-bold">Elevana</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary"
            >
              Produits
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary"
            >
              Catégories
            </Link>
            <Link
              href="/deals"
              className="text-sm font-medium hover:text-primary"
            >
              Promotions
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-md mx-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              {!isAuthenticated ? (
                <Button asChild>
                  <Link href="/login">Se Connecter</Link>
                </Button>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profil</span>
                  </Link>
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Panier</span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/products"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Produits
                  </Link>
                  <Link
                    href="/categories"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Catégories
                  </Link>
                  <Link
                    href="/deals"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Promotions
                  </Link>
                  <hr className="my-2" />
                  <div className="text-lg font-medium hover:text-primary">
                    {!isAuthenticated && !loading ? (
                      <Button asChild>
                        <Link href="/login">Se Connecter</Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="/profile">
                          <span className="sr-only">Profil</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
