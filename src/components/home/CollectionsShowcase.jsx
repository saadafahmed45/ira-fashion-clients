"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useCollections from "@/hooks/useCollections";

export default function CollectionsShowcase() {
  const { data: collections, isLoading } = useCollections();

  if (!isLoading && (!collections || collections.length === 0)) return null;

  return (
    <section className="py-20 md:py-28 bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div className="space-y-2">
            <span className="text-accent font-semibold tracking-[0.25em] uppercase text-[10px] block">
              Shop by Category
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-text-primary tracking-tight">
              Curated Collections
            </h2>
            <p className="text-text-secondary text-sm font-light">
              Explore custom capsules designed to build your modular wardrobe.
            </p>
          </div>
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-text-primary border-b border-text-primary pb-1 hover:text-accent hover:border-accent transition-all w-fit"
          >
            All Categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-surface border rounded-sm animate-pulse"
                />
              ))
            : collections?.slice(0, 3).map((collection) => (
                <Link
                  key={collection._id}
                  href={collection.slug ? `/product?collection=${collection.slug}` : `/product`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-surface border"
                >
                  {collection.imageUrl ? (
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-light to-accent-light">
                      <span className="text-7xl font-light text-brand/20">
                        {collection.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Subtle clean text overlay */}
                  <div className="absolute inset-0 bg-stone-900/10 transition-opacity duration-300 group-hover:bg-stone-900/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                    <h3 className="text-2xl font-serif font-light mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1 font-light max-w-xs">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/90 mt-4 border-b border-white/50 pb-0.5 group-hover:border-white transition-all">
                      Discover Collection
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
