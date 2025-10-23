"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfo } from "@/components/profile-info";
import { OrderHistory } from "@/components/order-history";
import { useAuth } from "@/lib/AuthContext";
import { Loading } from "@/components/loading";
import { FavorisProducts } from "@/components/favoris-products";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Mon compte
            </h1>
            <p className="text-lg text-muted-foreground">
              Bienvenue, {user?.firstName} {user?.lastName}
            </p>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="orders" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="orders">Mes commandes</TabsTrigger>
                <TabsTrigger value="favoris">Favoris</TabsTrigger>
                <TabsTrigger value="profile">Informations</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <OrderHistory />
              </TabsContent>
              <TabsContent value="favoris">
                <FavorisProducts />
              </TabsContent>
              <TabsContent value="profile">
                <ProfileInfo user={user} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
