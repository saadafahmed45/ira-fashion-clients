"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProductReviews, useCreateReview } from "@/hooks/useReviews";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

export function ReviewSection({ productId }) {
  const { isAuthenticated } = useAuthStore();
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const createReviewMutation = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reviews = reviewsData?.data || [];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!comment.trim()) {
      setErrorMessage("Please write a comment before submitting.");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        product: productId,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit review");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      {/* Review Submission Box */}
      <div className="bg-gray-50 p-6 border border-gray-100">
        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Leave a Review
            </h4>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                Thank you! Your verified review has been posted.
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {errorMessage}
              </div>
            )}

            {/* Star Rating Selector */}
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-gray-300 hover:text-amber-400 focus:outline-none transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-gray-700 ml-2">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div>
              <label className="text-[11px] font-medium text-gray-600 block mb-1.5">
                Your Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the fit, fabric quality, and finish..."
                className="w-full p-3 bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createReviewMutation.isPending}
            >
              Submit Review
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-gray-600 mb-3">
              Only verified customers can leave a review for this product.
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Sign In to Review
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4 divide-y divide-gray-100">
        {isLoading ? (
          <p className="text-xs text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">
            No reviews yet. Be the first to review this garment!
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="pt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-900">
                  {r.user?.name || "Customer"}
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= r.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
