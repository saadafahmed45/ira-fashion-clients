// app/product/[id]/page.jsx
import CartButton from "@/app/components/CartButton";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const fetchProduct = async (id) => {
  const res = await fetch(`https://ira-fashion-server.onrender.com/products/${id}`, {
    cache: "no-store", // Ensures fresh data on each request
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
};

const fetchRelatedProducts = async (id) => {
  const res = await fetch(`https://ira-fashion-server.onrender.com/products/${id}/related`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
};

const SingleProduct = async ({ params }) => {
  const { id } = params;

  const product = await fetchProduct(id);
  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(id);

  const { name, photoUrl, price, des } = product;

  return (
    <div className="py-2 md:px-16">
      <div className="text-gray-600 body-font overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="text-sm breadcrumbs m-2">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <span className="font-semibold">Product Details</span>
              </li>
            </ul>
          </div>

          <div className="lg:w-4/5 mx-auto flex flex-wrap py-16">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-contain object-center rounded"
              src={photoUrl}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">Adidas</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{name}</h1>
              <p className="leading-relaxed">{des}</p>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">$ {price}</span>
                <CartButton product={product} /> {/* Client-side cart button */}
              </div>
            </div>
          </div>

          <div className="related-products">
            <h2 className="text-xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className=" space-y-6 py-4">
                  {/* Card 3: With Quick Actions */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
                    <Link href={`/product/${relatedProduct._id}`}>
                      <img
                        src={relatedProduct.photoUrl}
                        alt={relatedProduct.name}
                        className=" w-100 md:w-80 object-cover"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <ShoppingCart
                          // onClick={() => !isInCart && handleCartAdded(pd)}
                          // disabled={isInCart}
                          className="w-5 h-5 text-blue-500"
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2"> {relatedProduct.name}</h3>
                      <p className="text-gray-600"> ${relatedProduct.price}</p>
                    </div>
                  </div>
                  {/* card  */}
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
