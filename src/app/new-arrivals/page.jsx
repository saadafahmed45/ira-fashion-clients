"use client";

import React, { useState } from "react";
import useProducts from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/shared/Pagination";
import { ProductCardSkeleton } from "@/components/shared/SkeletonLoader";
import { Sparkles } from "lucide-react";

export default function NewArrivalsPage() {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useProducts({
    page,
    limit: 12,
    status: "active",
    sort: "-createdAt",
  });

  const products = response?.data || [];
  const meta = response?.meta || {};

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-stone-200">
          <Sparkles size={24} className="text-amber-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">New Arrivals</h1>
            <p className="text-stone-500 text-sm mt-1">Fresh from the runway — the latest additions</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            No new arrivals yet. Check back soon!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} pd={product} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages || 1}
              onPageChange={setPage}
              hasNextPage={meta.hasNextPage}
              hasPrevPage={meta.hasPrevPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
