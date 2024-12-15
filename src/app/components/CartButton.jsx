// components/CartButton.jsx
"use client";

import React, { useContext } from "react";
import { CartContext } from "@/app/Context/Context";

const CartButton = ({ product }) => {
    const { handleCartAdded } = useContext(CartContext);

    return (
        <button
            className="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
            onClick={() => handleCartAdded(product)}
        >
            Add to Cart
        </button>
    );
};

export default CartButton;
