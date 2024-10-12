"use client";

import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.init";
import { toast } from "react-toastify";

export const CartContext = createContext([]);

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  // add to cart function
  function handleCartAdded(getCurrentItem) {
    if (!user) {
      toast.error("You need to be logged in to add items to the cart.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    let copyCartItems = [...cartItems];
    const indexOfCurrentItem = copyCartItems.findIndex(
      (item) => item._id === getCurrentItem._id
    );

    if (indexOfCurrentItem === -1) {
      copyCartItems.push(getCurrentItem);
    }

    setCartItems(copyCartItems);

    // Save the cart items to localStorage only if a user is logged in
    localStorage.setItem(
      `cartItems_${user.uid}`,
      JSON.stringify(copyCartItems)
    );

    toast.success("Product added to cart", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  // remove from cart function
  function removeFromCart(getCurrentItem) {
    if (!user) {
      toast.error("You need to be logged in to remove items from the cart.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    let copyCartItems = [...cartItems];
    copyCartItems = copyCartItems.filter((item) => item._id !== getCurrentItem);

    setCartItems(copyCartItems);

    // Save the updated cart items to localStorage only if a user is logged in
    localStorage.setItem(
      `cartItems_${user.uid}`,
      JSON.stringify(copyCartItems)
    );

    toast.warn("Product removed from cart", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  // Load cart items from localStorage when user logs in
  useEffect(() => {
    if (user) {
      setCartItems(
        JSON.parse(localStorage.getItem(`cartItems_${user.uid}`)) || []
      );
    }
  }, [user]);
  
  const [quantities, setQuantities] = useState([]);
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (quantities[item._id] || 1),
    0
  );

  // Shipping cost
  const shippingCost = 10; // You can adjust this value as needed
  const tax = 4; // You can adjust this value as needed

  // Calculate total price including shipping
  const totalPrice = subtotal + shippingCost + tax;

  // order
  const [orderDetails, setOrderDetails] = useState([]);

  const handleOrder = () => {
    const newOrder = {
      user,
      items: cartItems,
      totalPrice,
      orderDate: new Date().toISOString(),
    };
    setOrderDetails(newOrder);
  };
  console.log(orderDetails);
  // auth
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);


  const handleGoogleSign = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // ...
        setUser(user);
        // console.log(displayName);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("You are logged In", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  // sign out
  const handleSingOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser("");
        localStorage.setItem("user", JSON.stringify(""));

        toast.warn("You are logout", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        // An error happened.
      });
  };
  // localStorage save
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) || []);
  }, []);
  return (
    <CartContext.Provider
      value={{
        handleSingOut,
        handleGoogleSign,
        user,
        handleCartAdded,
        removeFromCart,
        cartItems,
        setCartItems,
        quantities,
        setQuantities,
        subtotal,
        totalPrice,
        handleOrder,
        orderDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default ContextProvider;
