"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ pd }) => {
  const { _id, name, photoUrl, price, des, category } = pd;
  const { cartItems, handleCartAdded } = useContext(CartContext);

  const isInCart = cartItems.some((item) => item._id === _id);
  return (
    <div className=" space-y-6 py-4">
      {/* Card 3: With Quick Actions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        <Link href={`/product/${_id}`}>
          <img
            src={photoUrl}
            alt={name}
            className=" w-100 md:w-80 object-cover"
          />
        </Link>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
            <Heart className="w-5 h-5 text-red-500" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
            <ShoppingCart
              onClick={() => !isInCart && handleCartAdded(pd)}
              disabled={isInCart}
              className="w-5 h-5 text-blue-500"
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2"> {name}</h3>
          <p className="text-gray-600"> ${price}</p>
        </div>
      </div>
      {/* card  */}
    </div>
  );
};

export default ProductCard;
