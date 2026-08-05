"use client";

import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/app/firebase/firebase.init";
import api from "@/lib/api";

export const AuthContext = createContext(null);

const TOKEN_KEY = "ira_fashion_token";
const ADMIN_EMAIL = "mohammadhaolader1@gmail.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const syncWithBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await api.post("/auth/google", { idToken });
      const data = res?.data || res;
      if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      const fetchedUser = data?.user || data;
      // Ensure admin role flag if email matches ADMIN_EMAIL
      if (fetchedUser && fetchedUser.email?.toLowerCase() === ADMIN_EMAIL) {
        fetchedUser.role = "admin";
      }
      return fetchedUser;
    } catch (err) {
      console.warn("[Auth] Backend Google auth sync failed:", err.message);
      const isEmailAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL;
      return {
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || "Customer",
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: isEmailAdmin ? "admin" : "customer",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const dbUser = await syncWithBackend(result.user);
      setUser(dbUser);
      return dbUser;
    } catch (error) {
      console.error("[Auth] Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailPassword = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const data = res?.data || res;
      if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      const userObj = data?.user || data;
      if (userObj && userObj.email?.toLowerCase() === ADMIN_EMAIL) {
        userObj.role = "admin";
      }
      setUser(userObj);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailPassword = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", userData);
      const data = res?.data || res;
      if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      const userObj = data?.user || data;
      if (userObj && userObj.email?.toLowerCase() === ADMIN_EMAIL) {
        userObj.role = "admin";
      }
      setUser(userObj);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      try {
        await api.post("/auth/logout");
      } catch (err) {
        console.warn("[Auth] Backend logout failed:", err.message);
      }
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try {
          const res = await api.get("/auth/me");
          const userObj = res?.data || res;
          if (userObj && userObj.email) {
            if (userObj.email.toLowerCase() === ADMIN_EMAIL) {
              userObj.role = "admin";
            }
            setUser(userObj);
          } else {
            setUser(null);
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const dbUser = await syncWithBackend(firebaseUser);
        setUser(dbUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const isAdmin = user?.role === "admin" || user?.email?.toLowerCase() === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmailPassword,
        registerWithEmailPassword,
        logout,
        isAuthenticated: !!user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
