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
  const { id } = params;

  const product = await fetchProduct(id);
  if (!product) notFound();

  const relatedProducts = await fetchRelatedProducts(id);

  const { name, photoUrl, price, des } = product;

  return (
    <div className="py-6 md:px-16">
      <div className="text-gray-600 body-font overflow-hidden">
        <div className="container px-4 mx-auto">
          {/* Breadcrumbs */}
          <div className="text-sm breadcrumbs mb-2 text-gray-500">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <span className="font-semibold text-gray-700">
                  Product Details
                </span>
              </li>
            </ul>
          </div>

          {/* Product Section */}
          <div className="lg:w-4/5 mx-auto flex flex-wrap py-10 gap-8">
            <div className="lg:w-1/2 w-full">
              <img
                alt={name}
                className="w-full h-[350px] md:h-[450px] object-contain rounded-lg"
                src={photoUrl}
              />
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 w-full space-y-4">
              <h2 className="text-sm uppercase text-gray-500 tracking-widest">
                Fashion Brand
              </h2>

              <h1 className="text-gray-900 text-3xl font-bold">{name}</h1>

              <p className="leading-relaxed text-gray-700">{des}</p>

              <div className="flex items-center gap-6 mt-4">
                <span className="text-3xl font-semibold text-gray-900">
                  ${price}
                </span>

                <CartButton product={product} />
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <div
                  key={rp._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Link href={`/product/${rp._id}`}>
                      <img
                        src={rp.photoUrl}
                        alt={rp.name}
                        className="w-full h-52 object-cover rounded-lg group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                      <button className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {rp.name}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm md:text-base">
                      ${rp.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
