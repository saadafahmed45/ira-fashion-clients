// app/product/[id]/page.jsx
import CartButton from "@/app/components/CartButton";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const fetchProduct = async (id) => {
  const res = await fetch(
    `https://ira-fashion-server.onrender.com/products/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return res.json();
};

const fetchRelatedProducts = async (id) => {
  const res = await fetch(
    `https://ira-fashion-server.onrender.com/products/${id}/related`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return res.json();
};

const SingleProduct = async ({ params }) => {
  // Await params before accessing its properties
  const { id } = await params;

  const product = await fetchProduct(id);
  if (!product) notFound();

  const relatedProducts = await fetchRelatedProducts(id);

  const { name, photoUrl, price, des } = product;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Product Details</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Section */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden">
                <img
                  alt={name}
                  className="w-full h-[400px] md:h-[500px] object-contain transform group-hover:scale-105 transition-transform duration-500"
                  src={photoUrl}
                />
              </div>
              <div className="absolute top-4 right-4">
                <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                  <Heart className="w-6 h-6 text-red-500" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full">
                  Fashion Brand
                </span>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {name}
                </h1>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{des}</p>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${price}
                  </span>
                  <span className="text-gray-500 line-through text-xl">
                    ${(price * 1.3).toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
                    Save 30%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <CartButton product={product} />

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Free Shipping</p>
                    <p className="text-sm font-semibold text-gray-900">
                      On orders $50+
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Easy Returns</p>
                    <p className="text-sm font-semibold text-gray-900">
                      30 days
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Warranty</p>
                    <p className="text-sm font-semibold text-gray-900">
                      1 year
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <p className="text-gray-600 mt-1">Discover similar products</p>
            </div>
            <Link
              href="/product"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group"
            >
              View All
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <div
                key={rp._id}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <Link href={`/product/${rp._id}`}>
                    <img
                      src={rp.photoUrl}
                      alt={rp.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-300">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                    <button className="bg-white p-2.5 rounded-full shadow-lg hover:bg-blue-50 hover:scale-110 transition-all duration-300">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {/* Sale Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      SALE
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <Link href={`/product/${rp._id}`}>
                    <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                      {rp.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                      ${rp.price}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
