import productApi from "../api/productApi";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

const NewArrival = async () => {
  const productsData = await productApi();
  // Get the latest 4 products
  const newProducts = productsData.slice(-4).reverse();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-amber-600 font-medium tracking-[0.2em] uppercase text-xs block mb-2">
              Fresh Off The Line
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/product"
            className="text-gray-900 font-semibold text-sm border-b-2 border-black pb-1 hover:text-amber-600 hover:border-amber-600 transition-all duration-300 w-fit"
          >
            Explore All Collection
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {newProducts.map((item) => (
            <div key={item._id} className="group flex flex-col">
              
              {/* Image Container with Hover Effects */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
                <Link href={`/product/${item._id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </Link>
                
                {/* Floating "New" Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-sm">
                    New
                  </span>
                </div>

                {/* Quick Add Overlay (Appears on Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-gradient-to-t from-black/20 to-transparent">
                  <AddToCartButton item={item} variant="quickview" /> 
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <Link href={`/product/${item._id}`} className="flex-1">
                    <h3 className="text-base font-medium text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <span className="text-base font-serif font-bold text-gray-900 ml-4">
                    ${item.price}
                  </span>
                </div>
                
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                  {item.productType || "Essential"}
                </p>

                {/* Stars Mini-Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < 4 ? "text-amber-400" : "text-gray-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">(4.0)</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;