"use client";

import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.init";
import { toast } from "react-toastify";

export const CartContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // ✅ FIX: quantities must be object
  const [quantities, setQuantities] = useState({});

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // LOGIN
  const handleGoogleSign = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login successful");
      })
      .catch(() => toast.error("Login failed"));
  };

  // LOGOUT
  const handleSingOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem("user");
      toast.warn("Logged out");
    });
  };

  // LOAD USER
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // CART ADD
  const handleCartAdded = (item) => {
    if (!user) return toast.error("Login required");

    const exists = cartItems.find((i) => i._id === item._id);
    if (!exists) {
      const updated = [...cartItems, item];
      setCartItems(updated);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updated));
      toast.success("Added to cart");
    }
  };

  // ✅ FIX REMOVE
  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem(`cart_${user?.uid}`, JSON.stringify(updated));
  };

  // LOAD CART
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      setCartItems(saved);
    }
  }, [user]);

  // ✅ FIX subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const qty = quantities?.[item._id] || 1;
    return sum + item.price * qty;
  }, 0);

  const totalPrice = subtotal + 10 + 4;

  return (
    <CartContext.Provider
      value={{
        user,
        handleGoogleSign,
        handleSingOut,
        cartItems,
        handleCartAdded,
        removeFromCart,
        quantities,
        setQuantities,
        subtotal,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default ContextProvider;