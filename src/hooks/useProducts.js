import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get("/products", { params });
      return response;
    },
    keepPreviousData: true,
  });
}

export function useProduct(idOrSlug) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const response = await api.get(`/products/${idOrSlug}`);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
}

export default useProducts;
