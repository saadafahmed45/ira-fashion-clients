import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useProductReviews(productId, params = {}) {
  return useQuery({
    queryKey: ["reviews", productId, params],
    queryFn: async () => {
      if (!productId) return null;
      const response = await api.get(`/reviews/product/${productId}`, { params });
      return response;
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await api.post("/reviews", reviewData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.product] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.product] });
    },
  });
}

export default useProductReviews;
