import { Category, Product, Review } from "@/db/models";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import apiLink from "./constants";

export function useProducts(params?: { id: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, editProfile } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
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
  useEffect(() => {
    if (params?.id) {
      getProductById();
      getReviews();
    }
  }, [params?.id]);
  const getProducts = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`${apiLink}/products`);
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

      const data = products
        .filter((p) => p.originalPrice && p.stock > 0)
        .slice(0, 4);
      setFeaturedProducts(data);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const getCategories = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`${apiLink}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(`${apiLink}/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify(product),
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  };
  const getProduct = async (id: number): Promise<Product | null> => {
    try {
      const res = await fetch(`${apiLink}/products/${id}`);
      const data = await res.json();
      if (data) return data;
      return null;
    } catch (error) {
      console.error("Error checking status:", error);
      return null;
    }
  };
  const getProductById = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`${apiLink}/products/${params?.id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };
  const addToFav = async (product: Product): Promise<boolean> => {
    try {
      if (user) {
        if (!user?.favProducts) {
          user.favProducts = [];
        }
        const exist = await existInFavList(product);
        if (!exist) {
          user.favProducts?.push(product.id as unknown as string);

          const isEdited = await editProfile(user);
          if (isEdited) {
            return true;
          }
          return false;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error checking status:", error);
      return false;
    }
  };
  const existInFavList = async (product: Product): Promise<boolean> => {
    try {
      if (user) {
        if (!user?.favProducts) {
          return false;
        }
        const index = user.favProducts?.indexOf(
          product.id as unknown as string
        );
        if (index !== -1) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error checking status:", error);
      return false;
    }
  };
  const removeFromFavList = async (product: Product): Promise<boolean> => {
    try {
      if (user) {
        if (!user?.favProducts) {
          user.favProducts = [];
          return true;
        }
        const exist = await existInFavList(product);
        if (exist) {
          user.favProducts = user.favProducts.filter(
            (item) => item !== (product.id as unknown as string)
          );

          const isEdited = await editProfile(user);
          if (isEdited) {
            return true;
          }
          return false;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error checking status:", error);
      return false;
    }
  };
  const getFavItems = async (): Promise<Product[] | null> => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (user) {
        if (!user?.favProducts) {
          return [];
        }
        const items: Product[] = [];
        user.favProducts.map(async (item) => {
          const prod = await getProduct(item as unknown as number);
          if (prod) items.push(prod);
        });
        setLoading(false);
        return items;
      }
      setLoading(false);
      return null;
    } catch (error) {
      console.error("Error checking status:", error);
      setLoading(false);
      return null;
    }
  };
  const getReviews = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`${apiLink}/reviews`);
      const data = await res.json();
      const reviewsData = data
        .filter((r: Review) => String(r.productId) === String(params?.id))
        .sort(
          (a: Review, b: Review) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const updateRating = async () => {
    try {
      const res = await fetch(`${apiLink}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");

      const data = await res.json();

      const reviewsData: Review[] = data
        .filter((r: Review) => String(r.productId) === String(params?.id))
        .sort(
          (a: Review, b: Review) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      if (reviewsData.length === 0) {
        console.log("No reviews found for this product");
        return;
      }

      const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
      const newRating = totalRating / reviewsData.length;
      const productData = await fetch(`${apiLink}/products/${params?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: newRating.toFixed(2),
          reviews: reviewsData.length,
        }),
      });
      const newProduct: Product = await productData.json();
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };
  const addReview = async (
    rating: number,
    comment: string
  ): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const review: Review = {
        id: `RV_${new Date().getTime()}`,
        productId: String(params?.id),
        userName: user?.firstName + " " + user?.lastName,
        rating: rating,
        comment: comment,
        date: new Date(),
      };
      const response = await fetch(`${apiLink}/reviews`, {
        method: "POST",
        body: JSON.stringify(review),
      });
      if (response) {
        setReviews([review, ...reviews]);
        await updateRating();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking status:", error);
      return false;
    }
  };

  return {
    products,
    featuredProducts,
    categories,
    product,
    loading,
    updateProduct,
    addToFav,
    existInFavList,
    removeFromFavList,
    getFavItems,
    reviews,
    addReview,
  };
}
