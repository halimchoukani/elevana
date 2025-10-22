"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { Loading } from "@/components/loading";
import { ReactNode } from "react";

const protectedRoutes = ["/checkout", "/order-confirmation"];
const afterLoginRoutes = ["/login", "/sign-up"];

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth state
    const isProtected = protectedRoutes.includes(pathname);
    const isAfterLogin = afterLoginRoutes.includes(pathname);

    if (isProtected && !user) {
      router.replace("/login");
    } else if (isAfterLogin && user) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <Loading />;

  return <>{children}</>;
}
