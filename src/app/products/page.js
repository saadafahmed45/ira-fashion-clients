import React, { Suspense } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { getProducts } from "@/lib/api/products";
import ProductsClientToolbar from "./ProductsClientToolbar";

export const metadata = {
  title: "All Products | Ira Fashion",
  description: "Browse our complete catalog of luxury apparel, fragrances, and accessories.",
};

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const sort = resolvedParams?.sort || "-createdAt";
  const vendor = resolvedParams?.vendor || "";
  const page = Math.max(Number(resolvedParams?.page) || 1, 1);

  const response = await getProducts({
    search,
    sort,
    ...(vendor && { vendor }),
    page,
    limit: 12,
  });

  const products = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  const buildQuery = (newPage) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (vendor) params.set("vendor", vendor);
    params.set("page", newPage);
    return `/products?${params.toString()}`;
  };

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

      {/* Filter and Sort Toolbar (Client Component for instant URL updates) */}
      <Suspense fallback={<div className="h-16 bg-[#F9F9F9] animate-pulse mb-8" />}>
        <ProductsClientToolbar currentVendor={vendor} currentSort={sort} />
      </Suspense>

      {/* Product Grid */}
      {products.length === 0 ? (
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
          {meta.hasPrevPage ? (
            <Link
              href={buildQuery(page - 1)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] hover:border-[#111111]"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] opacity-30 cursor-not-allowed">
              Previous
            </span>
          )}

          <span className="text-xs font-medium text-[#666666]">
            Page {meta.page} of {meta.totalPages}
          </span>

          {meta.hasNextPage ? (
            <Link
              href={buildQuery(page + 1)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] hover:border-[#111111]"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#E5E5E5] opacity-30 cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}
