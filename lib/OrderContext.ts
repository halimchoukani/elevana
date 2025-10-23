import { CartItem, Order } from "@/db/models";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useProducts } from "./ProductsContext";

export default function useOrder() {
  const userId = Cookies.get("userId");
  const { updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const confirmOrder = async (
    productsList: CartItem[],
    totalAmount: number,
    shippingAddress: string
  ): Promise<string | null> => {
    if (!userId) return null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const order = {
        id: "ORDR_" + new Date().getTime(),
        userId: parseInt(userId, 10),
        items: productsList,
        totalAmount,
        shippingAddress,
        orderDate: new Date(),
        status: "processing",
      };
      productsList.map(async (item: CartItem) => {
        item.product.stock -= item.quantity;
        await updateProduct(item.product);
      });
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) return null;
      return order.id;
    } catch (error) {
      return null;
    }
  };

  const getOrders = async (): Promise<Order[] | null> => {
    if (!userId) return null;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch("http://localhost:5000/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.error("Failed to fetch orders:", response.status);
        return null;
      }

      const orders: Order[] = await response.json();
      const userOrders = orders.filter(
        (order) => order.userId === parseInt(userId, 10)
      );

      return userOrders;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { confirmOrder, getOrders, loading };
}
