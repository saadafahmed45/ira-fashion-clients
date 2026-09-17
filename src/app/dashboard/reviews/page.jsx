"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Trash2, CheckCircle2, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardReviewsPage() {
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");

  const { data: reviewsData, isLoading, refetch } = useQuery({
    queryKey: ["adminReviews", page],
    queryFn: async () => {
      const res = await api.get("/reviews", { params: { page, limit: 15 } });
      return res;
    },
  });

  const reviews = reviewsData?.data || [];
  const meta = reviewsData?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleToggleApproval = async (id) => {
    try {
      await api.put(`/reviews/${id}/approval`);
      setMsg("Review approval updated");
      refetch();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to update review approval");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setMsg("Review deleted");
      refetch();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Reputation & Feedback
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Review Moderation
          </h1>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Total Reviews: {meta.total}
        </span>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3 font-semibold">Garment</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Rating</th>
              <th className="px-6 py-3 font-semibold">Comment</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No customer reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {r.product?.name || "Garment"}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{r.user?.name || "Customer"}</p>
                    <p className="text-[11px] text-gray-400">{r.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-sm">
                    <p className="line-clamp-2">{r.comment}</p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {formatDate(r.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={r.isApproved ? "success" : "default"}>
                      {r.isApproved ? "Approved" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleApproval(r._id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors ${
                          r.isApproved
                            ? "text-gray-600 hover:bg-gray-100"
                            : "text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {r.isApproved ? "Hide" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
