// "use client";
// import React, { useContext } from "react";
// import { productData } from "../api/productData";
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../Context/Context";

const Product = async () => {
  // const data = productData.products;
  const data = await productApi();
  return (
    <div className="h-full py-8  my-8 ">
      <div>
        <h2 className="text-2xl px-8 ">For Mans collection</h2>
      </div>
      {/* card  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {data.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
    </div>
  );
};

export default Product;
