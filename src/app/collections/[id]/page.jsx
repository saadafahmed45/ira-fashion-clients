"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingBag, Heart, Sparkles, Layers } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import SkeletonLoader from "@/components/shared/SkeletonLoader";

export default function SingleCollectionPage() {
  const params = useParams();
  const collectionId = params?.id;

  const { data: collection, isLoading, isError, refetch } = useCollection(collectionId);
  const addItemToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const products = Array.isArray(collection?.productIds) ? collection.productIds : [];
  const bgImage =
    collection?.image ||
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

          {isLoading ? (
            <div className="space-y-4 max-w-xl">
              <SkeletonLoader height="h-8" className="w-1/2 bg-white/20" />
              <SkeletonLoader height="h-16" className="w-full bg-white/10" />
            </div>
          ) : (
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Collection Edit ({products.length} {products.length === 1 ? "Product" : "Products"})
              </div>
              <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-widest font-serif mb-4 text-white">
                {collection?.name}
              </h1>
              {collection?.description && (
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden p-4 shadow-sm border border-gray-100">
                <SkeletonLoader height="h-64" className="w-full rounded-lg mb-4" />
                <SkeletonLoader height="h-5" className="w-3/4 mb-2" />
                <SkeletonLoader height="h-4" className="w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <p className="text-red-500 text-sm font-medium mb-4">Collection details could not be loaded.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
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
            {products.map((product) => {
              const mainImg =
                (Array.isArray(product.images) && product.images[0]) ||
                product.photoUrl ||
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";

              const isWishlisted = isInWishlist(product._id);

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                      <Link href={`/product/${product._id}`}>
                        <img
                          src={mainImg}
                          alt={product.title || product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                          isWishlisted
                            ? "bg-red-50 text-red-500"
                            : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Sale Badge */}
                      {product.compareAtPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <Link href={`/product/${product._id}`}>
                        <h3 className="text-sm font-semibold text-[#111111] group-hover:text-[#D4AF37] transition-colors truncate">
                          {product.title || product.name}
                        </h3>
                      </Link>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#111111]">${product.price}</span>
                        {product.compareAtPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ${product.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Footer */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() =>
                        addItemToCart({
                          id: product._id,
                          name: product.title || product.name,
                          price: product.price,
                          image: mainImg,
                        })
                      }
                      className="w-full py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[#D4AF37] hover:text-[#111111] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
