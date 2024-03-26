"use client";
import React, { useContext, useEffect } from "react";
import { CartContext } from "../Context/Context";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { user, cartItems } = useContext(CartContext);

  useEffect(() => {
    if (!cartItems) {
      router.push("/login");
    }
  }, [cartItems]);
  return cartItems ? children : null;
};

export default PrivateRoute;
