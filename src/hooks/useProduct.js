import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useProduct = (idOrSlug) => {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      const response = await api.get(`/products/${idOrSlug}`);
      return response.data; // returns single product object
    },
    enabled: !!idOrSlug,
  });
};

export default useProduct;
