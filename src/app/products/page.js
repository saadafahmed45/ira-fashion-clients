"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/features/products/hooks/useProducts";

function ProductsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-createdAt");
  const [vendor, setVendor] = useState("");

  const { data, isLoading } = useProducts({
    search,
    sort,
    ...(vendor && { vendor }),
    page,
    limit: 12,
  });

  const products = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="min-h-screen bg-white text-[#111111] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Title */}
      <div className="flex flex-col gap-2 mb-8 border-b border-[#E5E5E5] pb-6">
        <h1 className="text-3xl font-light uppercase tracking-wider text-[#111111]">
          {search ? `Search Results for "${search}"` : "All Products"}
        </h1>
        <p className="text-xs text-[#666666]">
          Showing {meta.total || products.length} premium handcrafted items
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-[#F9F9F9] border border-[#E5E5E5]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </div>

          <select
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="bg-white border border-[#E5E5E5] text-xs px-3 py-1.5 focus:outline-none"
          >
            <option value="">All Brands</option>
            <option value="IRA Fashion">IRA Fashion</option>
            <option value="IRA Fragrance">IRA Fragrance</option>
            <option value="IRA Couture">IRA Couture</option>
            <option value="IRA Atelier">IRA Atelier</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-medium text-[#666666]">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-[#E5E5E5] text-xs px-3 py-1.5 focus:outline-none font-medium"
          >
            <option value="-createdAt">Newest Arrivals</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <Filter className="w-10 h-10 text-[#999999]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
            No products match your criteria
          </h3>
          <p className="text-xs text-[#666666]">Try resetting your search query or brand filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-16 pt-8 border-t border-[#E5E5E5]">
          <button
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] disabled:opacity-30 hover:border-[#111111]"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-[#666666]">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] disabled:opacity-30 hover:border-[#111111]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-12 px-4 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)}
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
