import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import { getCollectionBySlug } from "@/lib/api/collections";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const collection = await getCollectionBySlug(resolvedParams?.id);

  return {
    title: collection ? `${collection.name} | Ira Fashion` : "Collection | Ira Fashion",
    description: collection?.description || "Explore our luxury fashion collection edit.",
  };
}

export default async function SingleCollectionPage({ params }) {
  const resolvedParams = await params;
  const collectionId = resolvedParams?.id;
  const collection = await getCollectionBySlug(collectionId);

  const products = Array.isArray(collection?.productIds) ? collection.productIds : [];
  const bgImage =
    collection?.imageUrl || collection?.image ||
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Header Banner */}
      <section className="relative bg-[#111111] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Collections
          </Link>

          {!collection ? (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-light uppercase text-white">Collection Not Found</h1>
            </div>
          ) : (
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Collection Edit ({products.length} {products.length === 1 ? "Product" : "Products"})
              </div>
              <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-widest font-serif mb-4 text-white">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#111111] mb-1">No products in this collection</h3>
            <p className="text-xs text-gray-500 mb-6">
              This collection does not have any items assigned to it yet. Check back soon for new arrivals!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} pd={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
