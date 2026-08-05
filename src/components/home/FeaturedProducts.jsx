"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts() {
  const { data: response, isLoading } = useProducts({
    limit: 8,
    status: "active",
    sort: "-createdAt",
  });

  const products = response?.data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div className="space-y-2">
            <span className="text-brand font-semibold tracking-[0.25em] uppercase text-[10px] block">
              Curated Selections
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-text-primary tracking-tight">
              Featured Products
            </h2>
            <p className="text-text-secondary text-sm font-light">
              Crafted from premium fabrics designed to stand the test of time.
            </p>
          </div>
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-text-primary border-b border-text-primary pb-1 hover:text-brand hover:border-brand transition-all w-fit"
          >
            View All Collection <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-background rounded-sm animate-pulse" />
                  <div className="h-4 bg-background rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-background rounded animate-pulse w-1/4" />
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product._id} pd={product} variant="classic" />
              ))}
        </div>
      </div>
    </section>
  );
}
