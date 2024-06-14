// "use client";
// import React, { useContext } from "react";
// import { productData } from "../api/productData";
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../Context/Context";

const Product = async () => {
  // const data = productData.products;
  const data = await productApi();

  const shoeItems = data?.filter((item) => item.category === "Shoes");
  const dressItems = data?.filter((item) => item.category === "Dress");
  const shirtItems = data?.filter((item) => item.category === "T-shirt");
  return (
    <div className="h-full py-8  my-8 space-y-6">
      <div>
        <h2 className="text-2xl px-8 ">Shoes collection</h2>
      </div>
      {/* card  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {shoeItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
      <div>
        <h2 className="text-2xl py-8 ">Dress collection</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {dressItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
      <div>
        <h2 className="text-2xl py-8 ">T-Shirt collection</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {shirtItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
    </div>
  );
};

export default Product;
