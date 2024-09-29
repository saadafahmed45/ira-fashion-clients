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
    <div className="h-full py-8 px-4  md:px-24  my-8 space-y-6">
      <div>
        <h2 className="text-2xl px-2 ">Shoes collection</h2>
      </div>
      {/* card  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
        {shoeItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
      <div>
        <h2 className="text-2xl py-2 ">Dress collection</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
        {dressItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
      <div>
        <h2 className="text-2xl py-2 ">T-Shirt collection</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
        {shirtItems.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>
    </div>
  );
};

export default Product;
