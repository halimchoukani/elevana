import { Category, Product } from "@/db/models";
import { useEffect, useState } from "react";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getCategories();
      await getProducts();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      getFeaturedProducts();
    }
  }, [products]);

  const getProducts = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const getFeaturedProducts = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (products.length === 0) return;
      const data = products.filter((p) => p.originalPrice).slice(0, 4);
      setFeaturedProducts(data);
      console.log("Featured products fetched:", data);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const getCategories = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  return {
    products,
    featuredProducts,
    categories,
    loading,
  };
}
