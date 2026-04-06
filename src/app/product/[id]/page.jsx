// app/product/[id]/page.jsx
import CartButton from "@/app/components/CartButton";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

// --- FETCHING LOGIC ---

const fetchProduct = async (id) => {
  const res = await fetch(`https://ira-fashion-server.onrender.com/products/${id}`, { 
    cache: "no-store" 
  });
  if (!res.ok) return null;
  return res.json();
};

const fetchRelatedProducts = async (currentId, productType) => {
  try {
    const res = await fetch(`https://ira-fashion-server.onrender.com/products`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    
    const allProducts = await res.json();
    
    // Filter by same type, exclude current product, and limit to 4
    return allProducts
      .filter(p => p.productType === productType && p._id !== currentId)
      .slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// --- COMPONENT ---

const SingleProduct = async ({ params }) => {
  const { id } = await params;
  const product = await fetchProduct(id);
  
  if (!product) notFound();

  // Get related products based on the current product's type
  const relatedProducts = await fetchRelatedProducts(id, product.productType);

  const { 
    name, title, photoUrl, images, price, des, 
    description, productType, vendor, variants 
  } = product;

  const displayName = title || name;
  const displayDesc = description || des;
  const displayImage = images?.[0] || photoUrl;
  const thumbImages = images?.length > 1 ? images.slice(0, 4) : [];
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
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 lg:gap-0 bg-stone-50 rounded-sm overflow-hidden shadow-sm border border-stone-200">

          {/* LEFT — IMAGE COLUMN */}
          <div className="relative">
            <div className="relative overflow-hidden bg-stone-200 aspect-[4/5] lg:aspect-auto lg:h-auto min-h-[480px]">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Badges */}
              <div className="absolute top-5 left-5">
                <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-stone-600 bg-stone-50/90 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  {productType || "New Arrival"}
                </span>
              </div>
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-50 bg-emerald-900/80 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  Save 30%
                </span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {thumbImages.length > 0 && (
              <div className="flex gap-2 p-4 bg-stone-50 border-t border-stone-100">
                {thumbImages.map((img, i) => (
                  <div key={i} className="relative overflow-hidden rounded-sm cursor-pointer flex-1 aspect-square opacity-70 hover:opacity-100 transition-opacity">
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
              </div>

              <div className="w-full h-px bg-gradient-to-r from-amber-600/40 via-amber-300/20 to-transparent" />

              <p className="text-stone-500 text-[15px] leading-relaxed font-light">
                {displayDesc}
              </p>

              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[clamp(32px,4vw,44px)] font-light text-stone-900 tracking-wide">
                    ${price}
                  </span>
                  <span className="font-serif text-xl text-stone-400 line-through">${originalPrice}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-2">
                <CartButton product={product} />
                <button className="w-full py-3.5 border border-stone-300 text-stone-700 text-[11px] tracking-[0.18em] uppercase font-medium rounded-sm hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-all duration-300">
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-stone-200">
              {[{ icon: "🚚", label: "Shipping" }, { icon: "↩", label: "Returns" }, { icon: "✦", label: "Quality" }].map(({ icon, label }) => (
                <div key={label} className="text-center">
                  <span className="text-lg">{icon}</span>
                  <p className="text-[9px] tracking-widest uppercase text-stone-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS SECTION ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between mb-10 pb-5 border-b border-stone-200">
              <div>
                <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400 block mb-2">Curated for you</span>
                <h2 className="font-serif text-3xl font-light text-stone-900">You May Also Like</h2>
              </div>
              <Link href="/product" className="text-[11px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 transition-colors">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => <ProductCard key={rp._id} pd={rp} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SingleProduct;