"use client";

import type React from "react";

import { useState } from "react";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User as UserType } from "@/db/models";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileInfoProps {
  user: UserType;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user in the backend
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Profil mis à jour");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    router.push("/");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Gérez vos informations de compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    className="pl-10"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="address"
                  name="address"
                  className="pl-10"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button type="submit" className="flex-1">
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier mes informations
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="space-y-6">
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Gérez la sécurité de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              Changer le mot de passe
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              Activer l'authentification à deux facteurs
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>Personnalisez votre expérience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              Gérer les notifications
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              Préférences de langue
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
