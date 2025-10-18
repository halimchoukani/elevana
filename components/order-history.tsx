"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock order data
/*const orders = [
  {
    id: "CMD-12345678",
    date: "15 janvier 2025",
    status: "delivered",
    total: 349.98,
    items: [
      {
        id: 1,
        name: "Casque Sans Fil Premium",
        image: "/premium-wireless-headphones.png",
        price: 299.99,
        quantity: 1,
      },
      {
        id: 5,
        name: "Tapis de Yoga Premium",
        image: "/premium-yoga-mat-rolled.jpg",
        price: 49.99,
        quantity: 1,
      },
    ],
  },
  {
    id: "CMD-12345677",
    date: "10 janvier 2025",
    status: "shipped",
    total: 249.99,
    items: [
      {
        id: 2,
        name: "Montre Connectée Sport",
        image: "/sport-smartwatch.jpg",
        price: 249.99,
        quantity: 1,
      },
    ],
  },
  {
    id: "CMD-12345676",
    date: "5 janvier 2025",
    status: "processing",
    total: 79.99,
    items: [
      {
        id: 3,
        name: "Sac à Dos Urbain",
        image: "/modern-urban-backpack.png",
        price: 79.99,
        quantity: 1,
      },
    ],
  },
];*/

const orders: any = [];

const statusConfig = {
  processing: {
    label: "En préparation",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  shipped: {
    label: "Expédié",
    icon: Truck,
    color: "bg-blue-100 text-blue-800",
  },
  delivered: {
    label: "Livré",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
};

export function OrderHistory() {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Aucune commande</h3>
          <p className="mb-6 text-muted-foreground">
            Vous n'avez pas encore passé de commande
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
        <h2 className="text-2xl font-bold">Historique des commandes</h2>
        <p className="text-sm text-muted-foreground">
          {orders.length} commandes
        </p>
      </div>

      {orders.map((order) => {
        const status = statusConfig[order.status as keyof typeof statusConfig];
        const StatusIcon = status.icon;

        return (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="mb-2">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Commandé le {order.date}
                  </p>
                </div>
                <Badge className={status.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
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
                        Quantité: {item.quantity} × {item.price.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">
                    {order.total.toFixed(2)} €
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir les détails
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      Commander à nouveau
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button size="sm">
                      <Truck className="mr-2 h-4 w-4" />
                      Suivre le colis
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
