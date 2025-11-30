// app/product/page.jsx
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";

const Product = async () => {
  const productsData = await productApi();

  const newShoeItems = productsData?.filter(
    (item) => item.category === "Shoes"
  );
  const newDressItems = productsData?.filter(
    (item) => item.category === "Dress"
  );
  const newShirtItems = productsData?.filter(
    (item) => item.category === "T-shirt"
  );

  return (
    <div className="min-h-screen px-4 md:px-24 py-12 space-y-16 bg-gray-50">
      {/* Section: Shoes */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
          Shoes Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {newShoeItems?.map((pd) => (
            <ProductCard pd={pd} key={pd._id} />
          ))}
        </div>
      </div>

      {/* Section: Dress */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-pink-500 pl-3">
          Dress Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {newDressItems?.map((pd) => (
            <ProductCard pd={pd} key={pd._id} />
          ))}
        </div>
      </div>

      {/* Section: T-Shirt */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-green-500 pl-3">
          T-Shirt Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {newShirtItems?.map((pd) => (
            <ProductCard pd={pd} key={pd._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
