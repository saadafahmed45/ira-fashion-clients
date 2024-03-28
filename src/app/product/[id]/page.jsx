"use client";
import { CartContext } from "@/app/Context/Context";
import { productData } from "@/app/api/productData";
import Link from "next/link";
import React, { useContext } from "react";

const SingleProduct = ({ params }) => {
  const prID = params.id;
  const data = productData.products;
  const product = data.find((p) => p.id === parseInt(prID));
  const { id, name, img, price, description } = product;

  const { handleCartAdded } = useContext(CartContext);

  return (
    <div className="h-[80vh] md:h-screen  px-2  md:px-24 md:py-8">
      <div className="m-8 p-4 text-3xl">Product Details</div>
      {/* warpper */}
      <div className=" flex place-items-center">
        <div className="shadow-xl h-[500px] md:h-[400px] w-[400px] md:w-full flex flex-col md:flex-row justify-around  items-center ">
          {/* img */}
          <div className="flex-2  ">
            <img
              className=" w-[400px]  md:h-[400px] rounded-md"
              src={img}
              alt=""
            />
          </div>
          {/* content */}
          <div className="flex-1 flex flex-col gap-2  w-[80%]    m-8">
            <h2 className="text-2xl"> {name}</h2>
            <h2 className="text-xl md:text-2xl">Price: ${price}</h2>
            <h2>Details: {description}</h2>
            <div>
              <button
                className="mt-8 border-2 border-[#FF3EA5] bg-white text-[#FF3EA5]  hover:bg-[#FF3EA5] hover:text-white  py-1 px-2"
                onClick={() => handleCartAdded(product)}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
