"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/shop/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";
import Skeleton from "@/components/ui/Skeleton";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL query params
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockParam = searchParams.get("inStock") === "true";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Fetch Categories
  const { data: categories = [] } = useCategories();

  // Fetch Products
  const queryArgs = {
    page: pageParam,
    limit: 12,
    sort: sortParam,
    status: "active",
    ...(categoryParam ? { category: categoryParam } : {}),
    ...(searchParam ? { search: searchParam } : {}),
    ...(minPriceParam ? { minPrice: minPriceParam } : {}),
    ...(maxPriceParam ? { maxPrice: maxPriceParam } : {}),
    ...(inStockParam ? { inStock: "true" } : {}),
  };

  const { data: productsData, isLoading } = useProducts(queryArgs);

  const products = productsData?.data || [];
  const meta = productsData?.meta || { total: 0, page: 1, totalPages: 1 };

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "" || val === null || val === undefined || val === false) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/products?${params.toString()}`);
  };

  const activeCategoryName =
    categories.find((c) => c.slug === categoryParam)?.name || "All Collections";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Haute Couture Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            {searchParam ? `Search: "${searchParam}"` : activeCategoryName}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {meta.total} curated garments
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-800 self-start"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Sort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-6 border border-gray-100">
            <FilterPanel
              categories={categories}
              selectedCategory={categoryParam}
              onSelectCategory={(cat) => updateFilters({ category: cat })}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              onPriceChange={(type, val) =>
                updateFilters({ [type === "min" ? "minPrice" : "maxPrice"]: val })
              }
              sort={sortParam}
              onSortChange={(sortVal) => updateFilters({ sort: sortVal })}
              inStock={inStockParam}
              onInStockChange={(stockVal) => updateFilters({ inStock: stockVal })}
              onReset={() => router.push("/products")}
            />
          </div>
        </aside>

        {/* Mobile Filter Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10">
              <FilterPanel
                categories={categories}
                selectedCategory={categoryParam}
                onSelectCategory={(cat) => {
                  updateFilters({ category: cat });
                  setMobileFilterOpen(false);
                }}
                minPrice={minPriceParam}
                maxPrice={maxPriceParam}
                onPriceChange={(type, val) =>
                  updateFilters({ [type === "min" ? "minPrice" : "maxPrice"]: val })
                }
                sort={sortParam}
                onSortChange={(sortVal) => updateFilters({ sort: sortVal })}
                inStock={inStockParam}
                onInStockChange={(stockVal) => updateFilters({ inStock: stockVal })}
                onReset={() => {
                  router.push("/products");
                  setMobileFilterOpen(false);
                }}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border border-gray-100 p-8">
              <h3 className="font-serif text-lg text-gray-900 mb-1">
                No garments found
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Try adjusting your search filters or browse other categories.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2 text-xs">
              <button
                disabled={!meta.hasPrevPage}
                onClick={() => updateFilters({ page: meta.page - 1 })}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider font-medium"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-500 font-medium">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNextPage}
                onClick={() => updateFilters({ page: meta.page + 1 })}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider font-medium"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
