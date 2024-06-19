"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";

const ProductCard = ({ pd }) => {
  const { _id, name, photoUrl, price, des, category } = pd;
  const { cartItems, handleCartAdded } = useContext(CartContext);

  const isInCart = cartItems.some((item) => item._id === _id);
  return (
    <div className="w-[px]  shadow-lg rounded-md   mt-8">
      {/* card  */}
      <div className="flex justify-end m-2">
        <Link href={`/product/${_id}`}>
          <img
            className="rounded-md w-80 relative left-0 top-0 object-cover object-center"
            // width={80}
            // height={80}
            src={photoUrl}
            alt={name}
          />
        </Link>
        <div className="absolute badge badge-secondary ">20% Discount</div>
      </div>
      <div className="p-2 m-2">
        <div className="mt-4">
          <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
            {category}
          </h3>
          <h2 className="text-gray-900 title-font text-lg font-medium">
            {name}
          </h2>
        </div>
        <div className="mt-6 flex justify-between ">
          {" "}
          <button
            className={`border-2 border-[#FF3EA5] bg-white text-[#FF3EA5] hover:bg-[#FF3EA5] hover:text-white py-1 px-2 ${
              isInCart ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isInCart && handleCartAdded(pd)}
            disabled={isInCart}
          >
            {isInCart ? "Added" : "Add to cart"}
          </button>
          <h2 className="text-gray-900 title-font text-lg font-medium">
            ${price}
          </h2>
          {/* <Link href={`/product/${id}`}>see more.</Link> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
