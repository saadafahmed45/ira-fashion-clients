"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    title: "The Art of Simplicity",
    subtitle: "Refined essentials for the modern lifestyle. Handcrafted from premium organic fibers.",
    cta: "Shop The Collection",
    href: "/product",
    img: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg",
  },
  {
    title: "Summer Essentials",
    subtitle: "Breathable linen shirts and relaxed tailoring designed for effortless warm-weather wear.",
    cta: "Explore Summer Lookbook",
    href: "/new-arrivals",
    img: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-background">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          key={slide.img}
          src={slide.img}
          alt={slide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-1000 ease-in-out opacity-90"
        />
        {/* Soft elegant overlay to ensure text readability */}
        <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-16 flex items-center">
        <div
          key={current}
          className="max-w-2xl space-y-6 md:space-y-8 animate-fade-in"
        >
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-text-primary bg-surface/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm border">
            New Arrival
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-text-primary leading-[1.1] tracking-tight">
            {slide.title}
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-light max-w-lg leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-brand-hover transition-all duration-300 hover:shadow-lg"
            >
              {slide.cta} <ArrowRight size={14} />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 border bg-surface/50 backdrop-blur-sm px-8 py-4 text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-surface hover:text-brand transition-all duration-300"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 right-6 md:right-16 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "bg-brand w-8" : "bg-text-secondary/30 w-3 hover:bg-text-secondary/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
