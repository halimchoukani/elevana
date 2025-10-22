"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Loading } from "@/components/loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <Loading />;
  return <>{children}</>;
}
