import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "react-toastify";

/**
 * Hook to manage admin or user orders
 */
export const useOrders = (isAdmin = false, params = {}) => {
  const queryClient = useQueryClient();

  // Fetch orders query
  const ordersQuery = useQuery({
    queryKey: ["orders", { isAdmin, params }],
    queryFn: async () => {
      const url = isAdmin ? "/admin/orders" : "/users/me/orders";
      const response = await api.get(url, { params });
      return response;
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update order status");
    },
  });

  return {
    ...ordersQuery,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};

export default useOrders;
