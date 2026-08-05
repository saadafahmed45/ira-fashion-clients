import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useAuth } from "../../auth/hooks/useAuth";
import { toast } from "react-toastify";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // 1. Get user wishlist
  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await api.get("/wishlist");
      return response.data; // returns array of product objects
    },
    enabled: isAuthenticated,
  });

  // 2. Toggle wishlist mutation
  const toggleMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await api.post(`/wishlist/${productId}`);
      return { productId, ...response.data };
    },
    onSuccess: (data) => {
      // Invalidate query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(data.message || "Wishlist updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update wishlist");
    },
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    toggleWishlist: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
};

export default useWishlist;
