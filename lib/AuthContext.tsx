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
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<boolean>;
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

  const register = async (
    userData: Omit<User, "id"> & { password: string }
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email already exists
    if (users.some((u: User) => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
    };

    // Store user with password in users array
    users.push({ ...newUser, password: userData.password });
    localStorage.setItem("users", JSON.stringify(users));

    // Store user without password in current session
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return true;
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
