"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useOrder from "@/lib/OrderContext";
import { useEffect, useState } from "react";
import { CartItem, Order } from "@/db/models";
import { Loading } from "./loading";

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
  const { getOrders, loading } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const myOrders = await getOrders();
      if (myOrders) {
        setOrders(myOrders);
      }
    };
    fetchOrders();
  }, []);
  if (loading) {
    return <Loading />;
  }
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
                    Commandé le {order.orderDate}
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
                {order.items.map((item: CartItem) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {item.quantity} ×{" "}
                        {item.product.price.toFixed(2)} €
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
                    {order.totalAmount.toFixed(2)} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
