"use client";

import { useContext } from "react";
import { CartContext } from "../Context/Context";

export default function AddToCartButton({ item }) {
  const { handleCartAdded } = useContext(CartContext);

  return (
    <button
      onClick={() => handleCartAdded(item)}
      className="bg-pink-500 hover:bg-pink-600 transition text-white font-medium rounded-lg text-sm px-4 py-2"
    >
      Add to cart
    </button>
  );
}
