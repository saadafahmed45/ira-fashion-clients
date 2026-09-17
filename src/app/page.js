import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Sparkles, RefreshCw, Star } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/api/products";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const productsResponse = await getProducts({ limit: 8, status: "active" });
  const featuredProducts = productsResponse?.data || [];

  const categorySpotlights = [
    {
      title: "Evening Dresses",
      slug: "dresses",
      subtitle: "Silk & Crepe Silhouettes",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Dubai Abayas",
      slug: "abayas-modest-wear",
      subtitle: "Royal Nida Craftsmanship",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Tops & Tunics",
      slug: "tops-tunics",
      subtitle: "Everyday Contemporary Chic",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Artisanal Sarees",
      slug: "sarees-traditional",
      subtitle: "Pure Katan & Jamdani",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
            alt="Ira Fashion Haute Couture Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 transition-transform duration-10000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-6">
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-amber-300 font-semibold">
            Spring / Summer 2026 Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight leading-tight">
            Modest Elegance <br />
            <span className="font-normal italic tracking-normal text-gray-200">Redefined</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-light leading-relaxed">
            Discover artisanal modest couture, royal Dubai abayas, and timeless silk sarees tailored for unforgettable moments.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gray-100 transition-all shadow-xl"
            >
              Explore Collection
            </Link>
            <Link
              href="/products?category=abayas-modest-wear"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/80 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              Shop Abayas
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Value Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-100">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-gray-800 flex-shrink-0 stroke-1" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Cash on Delivery</h4>
              <p className="text-[11px] text-gray-500">Pay courier after inspection</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gray-800 flex-shrink-0 stroke-1" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Authentic Fabrics</h4>
              <p className="text-[11px] text-gray-500">Dubai Nida & Pure Mulberry Silk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-gray-800 flex-shrink-0 stroke-1" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Artisanal Zari</h4>
              <p className="text-[11px] text-gray-500">Handcrafted by master weavers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-gray-800 flex-shrink-0 stroke-1" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Nationwide Shipping</h4>
              <p className="text-[11px] text-gray-500">Delivered within 48-72 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Spotlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Explore by Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorySpotlights.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-gray-900 block"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-medium">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider group-hover:underline">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Garments Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold block mb-1">
              Seasonal Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
              Featured Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
          >
            View All ({productsResponse?.meta?.total || 12}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#1A1A1A] text-white overflow-hidden py-16 sm:py-24 px-8 sm:px-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold">
              Exclusive Welcome Offer
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wide">
              Enjoy 10% Off Your First Order
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Experience the pinnacle of modest luxury. Apply voucher code <strong className="text-white font-mono uppercase bg-white/10 px-2 py-0.5 border border-white/20">WELCOME10</strong> at checkout for instant savings.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-white text-gray-900 text-xs font-semibold uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-10 space-y-2">
            <span className="text-3xl font-serif font-bold text-amber-300 block">
              100% COD
            </span>
            <p className="text-xs text-gray-400 max-w-xs">
              Zero upfront risk. Check garment quality at your doorstep before payment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
