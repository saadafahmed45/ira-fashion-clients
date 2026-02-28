// app/product/page.jsx
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";

const Product = async () => {
  const productsData = await productApi();

  return (
    <div className="min-h-screen px-4 md:px-24 py-12 space-y-16 bg-gray-50">
      {/* Section: Shoes */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
          All Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsData?.map((pd) => (
            <ProductCard pd={pd} key={pd._id} />
          ))}
        </div>
      </div>


     
    </div>
  );
};

export default Product;
