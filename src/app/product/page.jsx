"use client";
import React, { useContext } from "react";
import { productData } from "../api/productData";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../Context/Context";

const Product = () => {
  const data = productData.products;
  return (
    <div className="h-full py-8   ">
      {/* card  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {data.map((pd) => (
          <ProductCard pd={pd} key={pd.id} />
        ))}
      </div>
    </div>
  );
};

export default Product;
