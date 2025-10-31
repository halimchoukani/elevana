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
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useProducts } from "@/lib/ProductsContext";
import { toast } from "sonner";
import { Review } from "@/db/models";

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
  const [newRating, setNewRating] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const { reviews, addReview } = useProducts({ id: productId });
  const [isOpen, setIsOpen] = useState(false);
  const reviewDistribution = [1, 2, 3, 4, 5].map((star) => {
    const count = reviews.filter((r: Review) => r.rating === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return {
      stars: star,
      count,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });
  reviewDistribution.sort((a, b) => b.stars - a.stars);

  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedReview((prev) => (prev === id ? null : id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addToReview = async () => {
      if (comment.trim() !== "") {
        const added = await addReview(newRating, comment);
        if (added) {
          toast.success("Avis a été ajouter avec success :)");
          window.location.reload();
        } else {
          toast.error("Echoué :)");
        }
        setIsOpen(false);
      }
    };
    addToReview();
  };
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
      {isAuthenticated && (
        <div className="flex justify-center">
          <Dialog open={isOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Écrire un avis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Écrire un avis</DialogTitle>
                <DialogDescription>
                  Exprimez votre avis sur ce produit
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="mb-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(newRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseOver={() => {
                        setNewRating(i + 1);
                      }}
                    />
                  ))}
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Avis</Label>
                    <Textarea
                      placeholder="Écrire votre avis sur ce produit"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />{" "}
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    type="reset"
                  >
                    Annuler
                  </Button>

                  <Button type="submit">Ajouter votre avis</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 ">
        {reviews.map((review) => {
          const isExpanded = expandedReview === review.id;
          const shortText = review.comment.slice(0, 120);
          return (
            <div
              key={review.id}
              className="rounded-lg border p-6 bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.date).toUTCString()}
                  </p>
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
                {isExpanded ? review.comment : shortText}
                {review.comment.length > 120 && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="ml-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                  >
                    {isExpanded ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
