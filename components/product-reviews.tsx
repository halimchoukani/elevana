"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Textarea } from "./ui/textarea";

interface ProductReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

export function ProductReviews({
  productId,
  rating,
  reviewCount,
}: ProductReviewsProps) {
  // Mock review distribution
  const reviewDistribution = [
    { stars: 5, count: Math.floor(reviewCount * 0.6), percentage: 60 },
    { stars: 4, count: Math.floor(reviewCount * 0.25), percentage: 25 },
    { stars: 3, count: Math.floor(reviewCount * 0.1), percentage: 10 },
    { stars: 2, count: Math.floor(reviewCount * 0.03), percentage: 3 },
    { stars: 1, count: Math.floor(reviewCount * 0.02), percentage: 2 },
  ];

  // Mock reviews
  const reviews = [
    {
      id: 1,
      userName: "Marie D.",
      rating: 5,
      date: "15 janvier 2025",
      comment:
        "Excellent produit ! Exactement ce que je cherchais. La qualité est au rendez-vous et la livraison a été rapide.",
    },
    {
      id: 2,
      userName: "Thomas L.",
      rating: 4,
      date: "10 janvier 2025",
      comment:
        "Très bon rapport qualité-prix. Quelques petits détails à améliorer mais globalement très satisfait de mon achat.",
    },
    {
      id: 3,
      userName: "Sophie M.",
      rating: 5,
      date: "5 janvier 2025",
      comment:
        "Je recommande vivement ! Le produit correspond parfaitement à la description et dépasse mes attentes.",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Avis clients</h2>

      {/* Rating Overview */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/50 p-8">
          <div className="mb-2 text-5xl font-bold">{rating}</div>
          <div className="mb-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Basé sur {reviewCount} avis
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {reviewDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <span className="w-12 text-sm">{dist.stars} étoiles</span>
              <Progress value={dist.percentage} className="flex-1" />
              <span className="w-12 text-right text-sm text-muted-foreground">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-center">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button size="lg">Écrire un avis</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Avis</Label>
                  <Textarea placeholder="Type your message here." />{" "}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border p-6">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <Button variant="outline">Voir plus d'avis</Button>
      </div>
    </div>
  );
}
