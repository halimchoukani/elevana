import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import ProtectedRoute from "@/lib/ProtectedRoutes";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevana",
  description: "A lightweight Next.js e‑commerce demo app (TypeScript + Tailwind). This README replaces the default create-next-app content and documents how to run the project locally, start the mock API used by the frontend, and where to find important parts of the codebase.",
  openGraph: {
    title: "Elevana - A lightweight e‑commerce app",
    description: "A lightweight Next.js e‑commerce demo app (TypeScript + Tailwind). This README replaces the default create-next-app content and documents how to run the project locally, start the mock API used by the frontend, and where to find important parts of the codebase.",
    url: "https://elevana-n381.onrender.com/",
    siteName: "Elevana",
    images: [
      {
        url: "/meta-logo.png",
        width: 1200,
        height: 630,
        alt: "Elevana Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProtectedRoute>
            <CartProvider>
              <Header />
              {children}
            </CartProvider>
          </ProtectedRoute>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
