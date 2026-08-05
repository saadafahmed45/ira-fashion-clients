"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
}

export function useProduct(idOrSlug) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => productService.getProduct(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
}
