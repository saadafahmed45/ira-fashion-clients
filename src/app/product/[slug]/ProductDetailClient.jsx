"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Heart, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { VariantSelector } from "@/features/products/components/VariantSelector";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import { RelatedProducts } from "@/components/products/RelatedProducts";

// ─── Image Gallery (Slider + Thumbnails) ──────────────────────────────────────
function ProductImageGallery({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef(null);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleMouseMove = (e) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const activeImage = images[activeIdx] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        ref={mainRef}
        className="relative aspect-[3/4] w-full bg-[#F4F4F4] overflow-hidden border border-[#E8E8E8] cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={`${title} - Image ${activeIdx + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-300 ease-out ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={isZoomed ? {
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          } : {}}
        />

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-4 h-4 text-[#666666]" />
        </div>

        {/* Arrow Navigation (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-[#E5E5E5] flex items-center justify-center hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-[#E5E5E5] flex items-center justify-center hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    idx === activeIdx
                      ? "w-5 h-1.5 bg-[#111111]"
                      : "w-1.5 h-1.5 bg-[#111111]/30 hover:bg-[#111111]/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 z-10">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Select image ${idx + 1}`}
              className={`relative flex-shrink-0 w-[72px] h-[96px] border-2 transition-all duration-200 overflow-hidden ${
                idx === activeIdx
                  ? "border-[#111111]"
                  : "border-[#E5E5E5] hover:border-[#AAAAAA]"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="72px"
                className={`object-cover transition-opacity duration-200 ${
                  idx === activeIdx ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Product Detail Component ────────────────────────────────────────────
export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fallback demo product if backend product not seeded yet
  const activeProduct = product || {
    _id: "demo-detail",
    title: "Oud Noir Eau De Parfum",
    vendor: "IRA Fragrance",
    price: 120.0,
    compareAtPrice: 150.0,
    description: "An opulent blend of dark Cambodian oud, smoked amber, and damask rose. Crafted in France with 25% perfume oil concentration for all-day sillage.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&auto=format&fit=crop&q=80",
    ],
    options: [
      { name: "Capacity", values: ["30ml", "50ml", "100ml"] },
    ],
    variants: [
      { name: "30ml", price: 90.0, stock: 15, options: { Capacity: "30ml" } },
      { name: "50ml", price: 120.0, stock: 8, options: { Capacity: "50ml" } },
      { name: "100ml", price: 180.0, stock: 5, options: { Capacity: "100ml" } },
    ],
  };

  const images = activeProduct.images?.length > 0
    ? activeProduct.images
    : ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"];

  const currentPrice = selectedVariant?.price || activeProduct.price;
  const compareAtPrice = selectedVariant?.compareAtPrice || activeProduct.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > currentPrice;
  const discount = isOnSale ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100) : 0;
  const isLiked = isInWishlist(activeProduct._id);

  const handleAddToCart = () => {
    addItem(activeProduct, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="text-[11px] uppercase tracking-wider text-[#999999] mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-[#111111] transition-colors">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-[#111111] transition-colors">Products</a>
        <span>/</span>
        <span className="text-[#111111] font-medium truncate max-w-[200px]">{activeProduct.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* ── Left: Image Gallery ── */}
        <ProductImageGallery images={images} title={activeProduct.title} />

        {/* ── Right: Product Info ── */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">

          {/* Brand + Title */}
          <div>
            {activeProduct.vendor && (
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
                {activeProduct.vendor}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#111111] mt-1.5 leading-tight">
              {activeProduct.title}
            </h1>
          </div>

          {/* Rating row (static for now) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-[#888888]">4.9 (128 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#111111]">
              ${currentPrice?.toFixed(2)}
            </span>
            {isOnSale && (
              <>
                <span className="text-base text-[#AAAAAA] line-through">
                  ${compareAtPrice?.toFixed(2)}
                </span>
                <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-sm">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[#666666] leading-relaxed border-t border-b border-[#F0F0F0] py-5">
            {activeProduct.description}
          </p>

          {/* Variant Selector */}
          {activeProduct.options?.length > 0 && (
            <VariantSelector
              options={activeProduct.options}
              variants={activeProduct.variants}
              onVariantChange={handleVariantChange}
            />
          )}

          {/* Quantity */}
          <div className="flex items-center gap-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]">
              Quantity
            </span>
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => q + 1)}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 text-sm uppercase font-bold tracking-widest transition-all duration-300 ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-[#111111]"
              }`}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={() => toggleWishlist(activeProduct)}
              aria-label="Add to wishlist"
              className={`flex-shrink-0 p-4 border transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-[#E5E5E5] text-[#666666] hover:border-[#111111] hover:text-[#111111]"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#F0F0F0]">
            {[
              { icon: Truck, label: "Express Delivery" },
              { icon: RotateCcw, label: "30-Day Returns" },
              { icon: ShieldCheck, label: "Authentic Guarantee" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 bg-[#F9F9F9]">
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[9px] uppercase font-semibold text-[#555555] tracking-wide leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* SKU / Meta */}
          {activeProduct.sku && (
            <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider">
              SKU: {activeProduct.sku}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      <RelatedProducts
        currentProductId={activeProduct._id}
        vendor={activeProduct.vendor}
        initialProducts={relatedProducts}
      />
    </div>
  );
}
