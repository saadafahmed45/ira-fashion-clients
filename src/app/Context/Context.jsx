"use client";

import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.init";

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
    localStorage.setItem("cartItems", JSON.stringify(copyCartItems));
  }

  // remove to cart
  function removeFromCart(getCurrentItem) {
    // console.log(getCurrentItem);
    let copyCartItems = [...cartItems];
    copyCartItems = copyCartItems.filter((item) => item.id !== getCurrentItem);
    setCartItems(copyCartItems);
    localStorage.setItem("cartItems", JSON.stringify(copyCartItems));
  }
  // localStorage save
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cartItems")) || []);
  }, []);

  // auth
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const [user, setUser] = useState([]);

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

        alert("sign In");
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

        alert("sign out");
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
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default ContextProvider;
