"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Layers, Sparkles } from "lucide-react";

export default function CollectionsListClient({ initialCollections = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const collectionsList = Array.isArray(initialCollections) ? initialCollections : [];

  const filteredCollections = collectionsList.filter((col) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      col.name?.toLowerCase().includes(query) ||
      col.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Editorial Hero Header */}
      <section className="relative bg-[#111111] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Curated Edits & Seasonal Drops
          </div>
          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-widest font-serif mb-4">
            IRA <span className="font-semibold text-[#D4AF37]">COLLECTIONS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            Discover our meticulously curated capsule collections, signature aesthetics, and limited-edition luxury fashion drops.
          </p>
        </div>
      </section>

      {/* Control Bar: Search & Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-[#E5E5E5] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-lg text-xs sm:text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
            />
          </div>

          <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">
            Showing <span className="text-[#111111] font-bold">{filteredCollections.length}</span> {filteredCollections.length === 1 ? "Collection" : "Collections"}
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCollections.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#111111] mb-1">No collections found</h3>
            <p className="text-xs text-gray-500 mb-6">
              {searchQuery ? `No collections match "${searchQuery}".` : "No active collections available currently."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2 bg-[#111111] text-white text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection) => {
              const productCount = Array.isArray(collection.productIds) ? collection.productIds.length : 0;
              const imageUrl =
                collection.imageUrl || collection.image ||
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80";
              const collectionSlug =
                collection.slug ||
                (collection.name
                  ? collection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  : collection._id);

              return (
                <Link
                  key={collection._id}
                  href={`/collections/${collectionSlug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200/80 transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#111111] shadow-sm z-10">
                      {productCount} {productCount === 1 ? "Item" : "Items"}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h2 className="text-lg font-serif font-semibold text-[#111111] uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors mb-2">
                        {collection.name}
                      </h2>
                      {collection.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                          {collection.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[#111111]">
                      <span>Explore Line</span>
                      <ArrowRight className="w-4 h-4 text-[#111111] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
