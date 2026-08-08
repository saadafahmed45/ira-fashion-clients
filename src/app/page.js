import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Star, Sparkles, Package, Heart } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/Button";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { getFeaturedProducts, getProducts } from "@/lib/api/products";
import { getCollections } from "@/lib/api/collections";

const sampleProducts = [
  {
    _id: "demo-1",
    title: "Oud Noir Eau De Parfum",
    slug: "oud-noir-eau-de-parfum",
    vendor: "IRA Fragrance",
    price: 120.0,
    compareAtPrice: 150.0,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-2",
    title: "Silk Oversized Blazer",
    slug: "silk-oversized-blazer",
    vendor: "IRA Couture",
    price: 240.0,
    compareAtPrice: 280.0,
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-3",
    title: "Minimalist Leather Tote",
    slug: "minimalist-leather-tote",
    vendor: "IRA Atelier",
    price: 195.0,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-4",
    title: "Cashmere Turtleneck Sweater",
    slug: "cashmere-turtleneck-sweater",
    vendor: "IRA Knitwear",
    price: 180.0,
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"],
  },
];

const sampleNewArrivals = [
  {
    _id: "new-1",
    title: "Linen Wide-Leg Trouser",
    slug: "linen-wide-leg-trouser",
    vendor: "IRA Essentials",
    price: 145.0,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "new-2",
    title: "Merino Wool Turtleneck",
    slug: "merino-wool-turtleneck",
    vendor: "IRA Knitwear",
    price: 210.0,
    compareAtPrice: 250.0,
    images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "new-3",
    title: "Structured Wool Coat",
    slug: "structured-wool-coat",
    vendor: "IRA Couture",
    price: 420.0,
    compareAtPrice: 490.0,
    images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "new-4",
    title: "Gold Chain Shoulder Bag",
    slug: "gold-chain-shoulder-bag",
    vendor: "IRA Atelier",
    price: 310.0,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"],
  },
];

const sampleCollections = [
  { _id: "col-1", name: "Saree", slug: "saree", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80", productIds: [] },
  { _id: "col-2", name: "Three Piece", slug: "three-piece", imageUrl: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80", productIds: [] },
  { _id: "col-3", name: "Kameez", slug: "kameez", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", productIds: [] },
];

const testimonials = [
  { id: 1, name: "Ayesha R.", role: "Verified Buyer", rating: 5, text: "The quality is absolutely unmatched. I received so many compliments on my IRA saree at the wedding. Will definitely be ordering again!" },
  { id: 2, name: "Nadia K.", role: "Verified Buyer", rating: 5, text: "Shipping was fast and the packaging was luxurious. The three-piece set looks even better in person. IRA Fashion never disappoints." },
  { id: 3, name: "Fatima S.", role: "Verified Buyer", rating: 5, text: "I have been shopping with IRA for 2 years now. The fabrics are premium, the fits are perfect, and the service is always top notch." },
];

const categories = [
  { name: "Saree", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80", href: "/collections/saree" },
  { name: "Three Piece", image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&auto=format&fit=crop&q=80", href: "/collections/three-piece" },
  { name: "Kameez", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80", href: "/collections/kameez" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80", href: "/collections" },
];

export default async function HomePage() {
  // Parallel server-side data fetching
  const [featuredRes, newArrivalsRes, collections] = await Promise.all([
    getFeaturedProducts(4),
    getProducts({ limit: 4, status: "active", sort: "-createdAt" }),
    getCollections(),
  ]);

  const featuredProducts = featuredRes?.data?.length ? featuredRes.data : sampleProducts;
  const newArrivals = newArrivalsRes?.data?.length ? newArrivalsRes.data : sampleNewArrivals;
  const displayCollections = collections?.length ? collections.slice(0, 3) : sampleCollections;

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111111]">

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end justify-start overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=90"
          alt="IRA Fashion Hero"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-[10px] uppercase font-bold tracking-[0.35em] text-[#D4AF37] mb-5 border border-[#D4AF37]/40 px-4 py-1.5">
              Autumn / Winter 2026
            </span>
            <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-white uppercase leading-[1.05] mb-6">
              Wear the<br />
              <span className="font-bold italic">Extraordinary</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-md mb-10">
              Handcrafted luxury fashion for women — elevated sarees, signature silhouettes, and artisan accessories from IRA's new capsule.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/products">
                <button className="group flex items-center gap-3 bg-[#D4AF37] text-[#111111] px-8 py-4 text-xs uppercase font-bold tracking-widest hover:bg-white transition-all duration-300">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/collections">
                <button className="flex items-center gap-3 border border-white/50 text-white px-8 py-4 text-xs uppercase font-bold tracking-widest hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  Explore Edits
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-10 right-10 hidden lg:flex flex-col gap-3 z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-white text-center">
            <div className="text-2xl font-bold">5K+</div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Happy Clients</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-white text-center">
            <div className="text-2xl font-bold">200+</div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Styles</div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE STRIP ─────────────────────────────────────────── */}
      <div className="bg-[#111111] text-white py-3.5 overflow-hidden">
        <div className="flex items-center gap-0 animate-none">
          <div className="flex items-center gap-16 px-6 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-medium">
            {["Free Shipping on $150+", "New Arrivals Drop Weekly", "Authentic Premium Fabrics", "30-Day Easy Returns", "Worldwide Express Delivery", "Exclusive Member Offers"].map((text) => (
              <span key={text} className="flex items-center gap-4">
                <span className="w-1 h-1 rounded-full bg-[#D4AF37] inline-block" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CATEGORY GRID ─────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">Browse By Style</span>
          <h2 className="text-3xl font-light uppercase tracking-wider text-[#111111] mt-2">
            Shop <span className="font-bold">Categories</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden aspect-[3/4] bg-[#F9F9F9]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">{cat.name}</h3>
                <span className="text-white/70 text-[10px] uppercase tracking-wider flex items-center gap-1 mt-1 group-hover:text-[#D4AF37] transition-colors">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              {i === 0 && (
                <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#111111] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1">
                  Bestseller
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── VALUE PILLARS ─────────────────────────────────────────── */}
      <section className="bg-[#F9F9F9] border-y border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Worldwide Express", desc: "Free on orders over $150" },
              { icon: RotateCcw, title: "Easy 30-Day Returns", desc: "Effortless return policy" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Certified premium materials" },
              { icon: Package, title: "Luxury Packaging", desc: "Gift-ready every time" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-11 h-11 bg-white border border-[#E5E5E5] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">{title}</h4>
                  <p className="text-[11px] text-[#888888] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRENDING ESSENTIALS ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-12 border-b border-[#E5E5E5] pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Curated Selection</span>
            <h2 className="text-3xl font-light uppercase text-[#111111] tracking-wide mt-1">
              Trending <span className="font-bold">Essentials</span>
            </h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#111111] hover:text-[#D4AF37] transition-colors">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <button className="border border-[#111111] text-[#111111] px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-[#111111] hover:text-white transition-all">
              View All Products
            </button>
          </Link>
        </div>
      </section>

      {/* ─── SPLIT BANNER (Brand Story) ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
        {/* Image Side */}
        <div className="relative min-h-[400px] lg:min-h-auto">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=85"
            alt="IRA Fashion Story"
            fill
            className="object-cover"
          />
        </div>
        {/* Text Side */}
        <div className="bg-[#111111] text-white flex flex-col justify-center px-10 lg:px-20 py-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 font-bold">Our Philosophy</span>
          <h2 className="text-4xl sm:text-5xl font-light uppercase leading-tight mb-6">
            Crafted for<br />
            <span className="font-bold italic">The Modern Woman</span>
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            IRA Fashion is born from a deep appreciation for South Asian textile heritage combined with contemporary silhouettes. Every piece is designed with the modern woman in mind — confident, refined, and effortlessly elegant.
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-10">
            From hand-embroidered sarees to precision-cut blazers, we source only the finest fabrics and work with master artisans across Bangladesh.
          </p>
          <Link href="/products">
            <button className="group self-start flex items-center gap-3 border border-[#D4AF37] text-[#D4AF37] px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300">
              Discover the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ──────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-12 border-b border-[#E5E5E5] pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Fresh Drops
            </span>
            <h2 className="text-3xl font-light uppercase text-[#111111] tracking-wide mt-1">
              New <span className="font-bold">Arrivals</span>
            </h2>
          </div>
          <Link href="/new-arrivals" className="hidden sm:flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#111111] hover:text-[#D4AF37] transition-colors">
            See All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── COLLECTIONS SHOWCASE ──────────────────────────────────── */}
      {displayCollections.length > 0 && (
        <section className="py-20 bg-[#F9F9F9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">Explore</span>
              <h2 className="text-3xl font-light uppercase tracking-wider text-[#111111] mt-2">
                Our <span className="font-bold">Collections</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayCollections.map((col, idx) => {
                const imgUrl = col.imageUrl || col.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80";
                const slug = col.slug || col._id;
                const count = Array.isArray(col.productIds) ? col.productIds.length : 0;
                return (
                  <Link
                    key={col._id}
                    href={`/collections/${slug}`}
                    className="group relative overflow-hidden bg-white border border-[#E5E5E5] hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`relative overflow-hidden ${idx === 0 ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
                      <Image
                        src={imgUrl}
                        alt={col.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">{count} Items</div>
                      <h3 className="text-white text-lg font-bold uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                        {col.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-white/80 text-[10px] uppercase tracking-wider mt-2 group-hover:gap-2.5 transition-all">
                        Explore Edit <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/collections">
                <button className="border border-[#111111] text-[#111111] px-10 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#111111] hover:text-white transition-all duration-300">
                  All Collections
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-14">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">Customer Love</span>
          <h2 className="text-3xl font-light uppercase tracking-wider text-[#111111] mt-2">
            What Our <span className="font-bold">Clients Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#F9F9F9] border border-[#E5E5E5] p-8 flex flex-col gap-5">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-sm text-[#555555] leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#E5E5E5]">
                <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center text-white text-xs font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#999999]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ────────────────────────────────────────────── */}
      <section className="bg-[#111111] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-7">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Members Only</span>
            <h2 className="text-3xl sm:text-4xl font-light uppercase text-white tracking-wide mt-3">
              Join the <span className="font-bold">IRA Circle</span>
            </h2>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              Subscribe for early access to new drops, exclusive member offers, and style inspiration curated for you.
            </p>
          </div>
          <NewsletterForm />
          <p className="text-[10px] text-white/30 uppercase tracking-wider">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ──────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=85"
          alt="IRA Fashion Shop Now"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white flex flex-col items-center gap-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Limited Edition</span>
          <h2 className="text-4xl sm:text-6xl font-light uppercase leading-tight">
            Elevate Your<br />
            <span className="font-bold italic">Everyday Wardrobe</span>
          </h2>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            Every IRA garment is designed with strict attention to silhouette, premium fabric weight, and enduring construction.
          </p>
          <Link href="/products">
            <button className="group flex items-center gap-3 bg-white text-[#111111] px-10 py-4 text-xs uppercase font-bold tracking-widest hover:bg-[#D4AF37] transition-all duration-300 mt-2">
              Discover All Arrivals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
