"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Star } from "lucide-react";
import { TableRowSkeleton } from "../../../components/shared/SkeletonLoader";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await api.get("/admin/reviews");
      return res.data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status }) => api.put(`/admin/reviews/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review status updated");
    },
    onError: (err) => toast.error(err.message || "Failed to update review"),
  });

  const statusBadge = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Reviews</h1>
        <p className="text-stone-500 text-sm">{reviews.filter((r) => r.status === "pending").length} pending moderation</p>
      </div>

      <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {["Product", "Reviewer", "Rating", "Review", "Status", "Verified", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <Star size={40} className="mx-auto text-stone-300 mb-3" strokeWidth={1} />
                  <p className="text-stone-400 text-sm">No reviews yet</p>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-stone-50/50 transition-colors align-top">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-stone-800 max-w-[120px] line-clamp-2">
                      {review.productId?.title || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-stone-700">{review.userId?.name || "—"}</p>
                    <p className="text-[10px] text-stone-400">{review.userId?.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-stone-300"} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {review.title && <p className="text-xs font-semibold text-stone-800">{review.title}</p>}
                    <p className="text-xs text-stone-500 max-w-[200px] line-clamp-3">{review.body}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase ${statusBadge[review.status]}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold ${review.isVerifiedPurchase ? "text-emerald-600" : "text-stone-400"}`}>
                      {review.isVerifiedPurchase ? "✓ Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => reviewMutation.mutate({ id: review._id, status: "approved" })}
                          className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-sm transition"
                          title="Approve"
                        >
                          <CheckCircle size={17} />
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => reviewMutation.mutate({ id: review._id, status: "rejected" })}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition"
                          title="Reject"
                        >
                          <XCircle size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
