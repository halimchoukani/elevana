"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { User } from "@/db/models";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: User & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
      const user = await response.json();
      const userData = user[0] as User | undefined;
      if (userData && userData.password === password) {
        const { password: _, ...userWithoutPassword } = userData;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        console.log(userWithoutPassword);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
