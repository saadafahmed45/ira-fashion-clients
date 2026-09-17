"use client";

import React, { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/queryClient";
import { useAuthStore } from "@/store/authStore";

const Providers = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
