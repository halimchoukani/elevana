"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CartItem, User } from "@/db/models";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: User & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  editProfile: (updatedData: Partial<User>) => Promise<boolean>;
  editLoading: boolean;
  getCart: () => Promise<CartItem[] | undefined>;
  updateCart: (items: CartItem[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      await isLoggedIn();
    };
    init();
  }, []);
  const updateCart = async (items: CartItem[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const id = Cookies.get("userId");
      if (id) {
        const user = await getUserById(id);
        if (user) {
          user.cart = items;
          const update = await editProfile(user);
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(items));
      }

      // Optional: if you want to verify user exists
    } catch (error) {
      console.error(error);
    }
  };
  const getCart = async (): Promise<CartItem[] | undefined> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const id = Cookies.get("userId");
      if (!id) {
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) {
          return [];
        }
        return JSON.parse(savedCart);
      }

      // Optional: if you want to verify user exists
      const user = await getUserById(id);
      if (!user) {
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) {
          return [];
        }
        return JSON.parse(savedCart);
      }

      return user.cart;
    } catch (error) {}
    return [];
  };
  const getUserById = async (id: string | number): Promise<User | null> => {
    try {
      const userId = typeof id === "string" ? parseInt(id, 10) : id;

      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("User fetch failed with status:", response.status);
        return null;
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error("Fetch user by ID failed:", error);
      return null;
    }
  };

  const isLoggedIn = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const savedUserData = Cookies.get("userId");

      if (savedUserData) {
        let savedUserId: string;

        try {
          const parsed = JSON.parse(savedUserData);
          savedUserId = parsed.id ?? parsed;
        } catch {
          savedUserId = savedUserData;
        }

        const savedUser = await getUserById(savedUserId);
        if (savedUser) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user exists in localStorage
    try {
      const response = await fetch(
        `http://localhost:5000/users?email=${email}`,
        {
          method: "GET",
        }
      );
      const userres = await response.json();
      const userData = userres[0] as User | undefined;
      if (userData && userData.password === password) {
        const { password: _, ...userWithoutPassword } = userData;
        Cookies.set("userId", String(userData.id), {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        setUser(userWithoutPassword);
        //Update user cart :
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length > 0) {
          // Convert both to arrays safely
          const existingCart = Array.isArray(userData.cart)
            ? userData.cart
            : [];

          // Start merging
          const mergedCart = [...existingCart];

          cart.forEach((item: any) => {
            const existingItemIndex = mergedCart.findIndex(
              (c) => c.product.id === item.product.id
            );

            if (existingItemIndex !== -1) {
              // Product already exists → update quantity
              mergedCart[existingItemIndex].quantity += item.quantity;
            } else {
              // Product not found → add new one
              mergedCart.push(item);
            }
          });

          const updatedUser = { ...userData, cart: mergedCart };
          await editProfile(updatedUser);

          // Clear local cart after syncing
          localStorage.setItem("cart", JSON.stringify([]));
        }

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  const checkEmailExist = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(
        `http://localhost:5000/users?email=${email}`,
        {
          method: "GET",
        }
      );
      const user = await response.json();
      const userData = user[0] as User | undefined;
      if (userData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Email finding failed:", error);
      throw error;
    }
  };
  const register = async (
    userData: User & { password: string }
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      if (userData === null) return false;
      if (!(await checkEmailExist(userData.email))) {
        const response = await fetch(`http://localhost:5000/users`, {
          method: "POST",
          body: JSON.stringify(userData),
        });
        const user = await response.json();
        if (user) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };
  const editProfile = async (updatedData: Partial<User>): Promise<boolean> => {
    setEditLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const id = Cookies.get("userId");
    if (!id) return false;
    const thisUser = await getUserById(id);
    if (!thisUser) return false;
    const updatedUser = { ...thisUser, ...updatedData };

    setUser(updatedUser);

    try {
      const response = await fetch(
        `http://localhost:5000/users/${thisUser.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) {
        setEditLoading(false);
        return false;
      }
      setEditLoading(false);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setEditLoading(false);
    return false;
  };
  const logout = () => {
    setUser(null);
    Cookies.remove("userId");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        editProfile,
        getCart,
        editLoading,
        updateCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
