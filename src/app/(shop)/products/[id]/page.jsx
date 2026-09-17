"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Star, Check } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import ReviewSection from "@/components/shop/ReviewSection";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-gray-900 mb-2">Garment Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">
          The requested product could not be located or may have been archived.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const images = product.images?.length > 0 ? product.images : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900">Products</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-gray-50 border transition-all ${
                    selectedImageIndex === idx
                      ? "border-gray-900 ring-1 ring-gray-900"
                      : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Information */}
        <div className="space-y-6 flex flex-col justify-start">
          <div>
            {product.category?.name && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
                {product.category.name} • {product.brand || "Ira Fashion"}
              </span>
            )}
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            {product.ratings > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.ratings)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {product.ratings.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(activePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    Save {formatPrice(product.price - product.discountPrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock availability */}
          <div className="text-xs">
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="text-rose-600 font-medium">Sold Out</span>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-b border-gray-100 py-4 text-xs text-gray-600 leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>

          {/* Quantity & Add to Cart Controls */}
          {product.stock > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold text-gray-900 min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-gray-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedNotice ? "Added to Bag!" : "Add to Shopping Bag"}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border transition-colors ${
                    isLiked
                      ? "border-rose-300 bg-rose-50 text-rose-600"
                      : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                </button>
              </div>

              {addedNotice && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Item added to your bag. Ready for checkout!</span>
                </div>
              )}
            </div>
          )}

          {/* Delivery & Trust Highlights */}
          <div className="bg-gray-50/70 border border-gray-100 p-4 space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-800" />
              <span>Nationwide 48-72h Delivery | Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic High-Thread-Count Fabrics Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Tab Section */}
      <div className="mt-20 pt-12 border-t border-gray-100">
        <ReviewSection productId={product._id} />
      </div>
    </div>
  );
}
