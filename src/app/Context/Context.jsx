"use client";

import { createContext, useEffect, useState } from "react";

export const CartContext = createContext([]);

const ContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const handleAdded = () => {
    alert("added");
  };

  // add cart fun
  function handleCartAdded(getCurrentItem) {
    let copyCartItems = [...cartItems];
    const indexOfCurrentItem = copyCartItems.findIndex(
      (item) => item.id === getCurrentItem.id
    );
    console.log(copyCartItems);
    if (indexOfCurrentItem === -1) {
      copyCartItems.push(getCurrentItem);
    }
    setCartItems(copyCartItems);
    // localStorage.setItem("cartItems", JSON.stringify(copyCartItems));
  }

  return (
    <CartContext.Provider value={{ handleCartAdded, cartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export default ContextProvider;
