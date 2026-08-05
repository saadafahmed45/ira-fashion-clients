"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useAuth } from "@/features/auth/hooks/useAuth";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { items: wishlist, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 bg-white px-4 text-center">
        <div className="w-20 h-20 bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#999999]" strokeWidth={1} />
        </div>
        <div>
          <h2 className="text-2xl font-light uppercase tracking-wider text-[#111111] mb-2">Your Wishlist</h2>
          <p className="text-xs text-[#666666] mb-6">Sign in to save and view your favourite items.</p>
        </div>
        <Link href="/login">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 pb-4 border-b border-[#E5E5E5]">
          <h1 className="text-3xl font-light uppercase tracking-wider text-[#111111]">
            My Wishlist{" "}
            <span className="text-[#999999] font-light text-xl">({wishlist.length})</span>
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <Heart className="w-12 h-12 text-[#E5E5E5]" strokeWidth={1} />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Your wishlist is empty</p>
            <p className="text-xs text-[#666666]">Start adding items you love.</p>
            <Link href="/products">
              <Button variant="outline" size="md">Browse Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const image = product.images?.[0] || product.photoUrl;
              return (
                <div key={product._id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden">
                    <Link href={`/product/${product.slug || product._id}`}>
                      {image ? (
                        <Image
                          src={image}
                          alt={product.title || "Product"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-[#CCCCCC]" strokeWidth={1} />
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 hover:bg-red-50"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>

                  <div className="pt-3 flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#666666]">
                        {product.vendor || product.productType || "IRA Fashion"}
                      </span>
                      <Link href={`/product/${product.slug || product._id}`} className="block">
                        <h4 className="text-xs font-medium text-[#111111] hover:underline line-clamp-1">
                          {product.title || product.name}
                        </h4>
                      </Link>
                      <span className="text-xs font-semibold text-[#111111]">
                        ${product.price?.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className="w-full py-2 bg-[#111111] text-white text-[10px] uppercase font-semibold tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#333333] transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
