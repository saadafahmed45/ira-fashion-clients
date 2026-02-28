// app/product/[id]/page.jsx
import CartButton from "@/app/components/CartButton";
import Link from "next/link";
import { notFound } from "next/navigation";

const fetchProduct = async (id) => {
  const res = await fetch(`https://ira-fashion-server.onrender.com/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
};

const fetchRelatedProducts = async (id) => {
  const res = await fetch(`https://ira-fashion-server.onrender.com/products/${id}/related`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
};

const SingleProduct = async ({ params }) => {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();

  const relatedProducts = await fetchRelatedProducts(id);
  const { name, title, photoUrl, images, price, des, description, productType, vendor, variants } = product;

  const displayName  = title || name;
  const displayDesc  = description || des;
  const displayImage = images?.[0] || photoUrl;
  const thumbImages  = images?.length > 1 ? images.slice(0, 4) : [];
  const originalPrice = (price * 1.3).toFixed(2);

  return (
    <div className="min-h-screen bg-stone-100 font-sans">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1380px] mx-auto px-6 md:px-10 pt-8 pb-0">
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors duration-200">Home</Link>
          <span>·</span>
          <Link href="/product" className="hover:text-stone-700 transition-colors duration-200">Collection</Link>
          <span>·</span>
          <span className="text-stone-600">{displayName}</span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <main className="max-w-[1380px] mx-auto px-6 md:px-10 py-10">
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 lg:gap-0 bg-stone-50 rounded-sm overflow-hidden shadow-sm">

          {/* LEFT — IMAGE COLUMN */}
          <div className="relative">
            {/* Main image */}
            <div className="relative overflow-hidden bg-stone-200 aspect-[4/5] lg:aspect-auto lg:h-full min-h-[480px]">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient overlay bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900/30 to-transparent pointer-events-none" />

              {/* Wishlist */}
              <button className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-stone-50/90 backdrop-blur-sm rounded-full hover:scale-110 hover:bg-stone-50 transition-all duration-200 shadow-sm group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-red-500 transition-colors duration-200">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>

              {/* Sale badge */}
              <div className="absolute top-5 left-5">
                <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-stone-600 bg-stone-50/90 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  {productType || "New Arrival"}
                </span>
              </div>

              {/* Discount ribbon */}
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-50 bg-emerald-900/80 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  Save 30%
                </span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {thumbImages.length > 0 && (
              <div className="flex gap-2 p-4 bg-stone-50">
                {thumbImages.map((img, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-sm cursor-pointer flex-1 aspect-square ${i === 0 ? "ring-2 ring-stone-900 ring-offset-1" : "opacity-60 hover:opacity-100 transition-opacity"}`}>
                    <img src={img} alt={`view-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER DIVIDER */}
          <div className="hidden lg:block w-px bg-stone-200" />

          {/* RIGHT — INFO COLUMN */}
          <div className="flex flex-col justify-between p-8 md:p-12 lg:p-14">
            <div className="space-y-8">

              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-amber-600" />
                  <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-stone-400">
                    {vendor || "Ira Fashion"}
                  </span>
                </div>

                <h1 className="font-serif text-[clamp(30px,4vw,52px)] font-light text-stone-900 leading-[1.1] tracking-wide">
                  {displayName}
                </h1>

                {/* Star rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[0,1,2,3].map(i => (
                      <svg key={i} className="w-3 h-3 fill-amber-500" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <svg className="w-3 h-3 fill-stone-300" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-stone-400 tracking-wide">4.9 · 128 reviews</span>
                </div>
              </div>

              {/* Gold divider */}
              <div className="w-full h-px bg-gradient-to-r from-amber-600/40 via-amber-300/20 to-transparent" />

              {/* Description */}
              <p className="text-stone-500 text-[15px] leading-relaxed font-light">
                {displayDesc || "A beautifully crafted piece made for the modern wardrobe. Timeless design meets exceptional quality."}
              </p>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[clamp(32px,4vw,44px)] font-light text-stone-900 tracking-wide">
                    ${price}
                  </span>
                  <span className="font-serif text-xl text-stone-400 line-through">${originalPrice}</span>
                </div>
                <p className="text-[11px] tracking-[0.12em] uppercase text-emerald-700 font-medium">
                  You save ${(originalPrice - price).toFixed(2)}
                </p>
              </div>

              {/* Variants */}
              {variants?.length > 0 && (
                <div className="space-y-4">
                  {/* Sizes */}
                  {variants.some(v => v.size) && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2.5">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(variants.map(v => v.size).filter(Boolean))].map(size => (
                          <button key={size} className="w-10 h-10 border border-stone-300 text-stone-700 text-sm font-medium rounded-sm hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-all duration-200">
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {variants.some(v => v.color) && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2.5">Color</p>
                      <div className="flex gap-2.5">
                        {[...new Set(variants.map(v => v.color).filter(Boolean))].map((color, i) => (
                          <button
                            key={i}
                            style={{ backgroundColor: color }}
                            className="w-7 h-7 rounded-full border-2 border-stone-50 ring-1 ring-stone-300 hover:ring-stone-900 hover:scale-110 transition-all duration-200"
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 pt-2">
                <CartButton product={product} />
                <button className="w-full py-3.5 border border-stone-300 text-stone-700 text-[11px] tracking-[0.18em] uppercase font-medium rounded-sm hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Bottom trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-stone-200">
              {[
                { icon: "🚚", label: "Free Shipping", sub: "Orders $50+" },
                { icon: "↩", label: "Easy Returns",  sub: "30 days" },
                { icon: "✦", label: "Authenticity",  sub: "Guaranteed" },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="text-center space-y-1">
                  <span className="text-lg">{icon}</span>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-stone-500 font-medium">{label}</p>
                  <p className="text-[11px] text-stone-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts?.length > 0 && (
          <section className="mt-24">

            {/* Section header */}
            <div className="flex items-end justify-between mb-10 pb-5 border-b border-stone-200">
              <div>
                <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400 block mb-2">
                  Curated for you
                </span>
                <h2 className="font-serif text-[clamp(26px,3.5vw,40px)] font-light text-stone-900 tracking-wide">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/product"
                className="text-[11px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 flex items-center gap-2 transition-colors duration-200 group pb-1"
              >
                View All
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
              </Link>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center gap-4 mb-10 opacity-25">
              <div className="flex-1 h-px bg-amber-700" />
              <span className="font-serif text-sm text-amber-700">✦</span>
              <div className="flex-1 h-px bg-amber-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => {
                const rpImage = rp.images?.[0] || rp.photoUrl;
                const rpName  = rp.title || rp.name;
                return (
                  <div
                    key={rp._id}
                    className="group relative bg-stone-50 overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 ease-out rounded-sm"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                      <Link href={`/product/${rp._id}`}>
                        <img
                          src={rpImage}
                          alt={rpName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] tracking-[0.15em] uppercase text-stone-600 bg-stone-50/88 backdrop-blur-sm px-2 py-1 rounded-sm">
                          {rp.productType || "New"}
                        </span>
                      </div>

                      {/* Quick add on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <Link
                          href={`/product/${rp._id}`}
                          className="block w-full py-2.5 text-center text-[10px] font-medium tracking-[0.14em] uppercase bg-stone-50/95 text-stone-900 backdrop-blur-md rounded-sm hover:bg-stone-900 hover:text-stone-50 transition-colors duration-200"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>

                    <div className="px-4 pt-3.5 pb-5">
                      <div className="flex gap-0.5 mb-2">
                        {[0,1,2,3].map(i => (
                          <svg key={i} className="w-2.5 h-2.5 fill-amber-500" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                        <svg className="w-2.5 h-2.5 fill-stone-300" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>

                      <div className="w-6 h-px bg-gradient-to-r from-amber-600 to-transparent mb-2.5" />

                      <Link href={`/product/${rp._id}`}>
                        <h3 className="font-serif text-[17px] font-light text-stone-900 leading-snug group-hover:text-amber-800 transition-colors duration-200 line-clamp-2">
                          {rpName}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-serif text-lg text-stone-900 tracking-wide">${rp.price}</span>
                        <span className="text-[10px] text-stone-400 line-through font-serif">${(rp.price * 1.3).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SingleProduct;