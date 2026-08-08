import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api/products";
import { Sparkles } from "lucide-react";

export default async function NewArrivalsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Math.max(Number(resolvedParams?.page) || 1, 1);

  const response = await getProducts({
    page,
    limit: 12,
    status: "active",
    sort: "-createdAt",
  });

  const products = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1 };

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

        {products.length === 0 ? (
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

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8 border-t border-stone-200">
                {meta.hasPrevPage ? (
                  <Link
                    href={`/new-arrivals?page=${page - 1}`}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-stone-300 hover:bg-stone-100"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-stone-200 text-stone-300 cursor-not-allowed">
                    ← Previous
                  </span>
                )}
                <span className="text-xs text-stone-600">
                  Page {meta.page} of {meta.totalPages}
                </span>
                {meta.hasNextPage ? (
                  <Link
                    href={`/new-arrivals?page=${page + 1}`}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-stone-300 hover:bg-stone-100"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-stone-200 text-stone-300 cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
