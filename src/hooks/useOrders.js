import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useMyOrders(params = {}) {
  return useQuery({
    queryKey: ["myOrders", params],
    queryFn: async () => {
      const response = await api.get("/orders/my-orders", { params });
      return response;
    },
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

export function useAllOrders(params = {}) {
  return useQuery({
    queryKey: ["allOrders", params],
    queryFn: async () => {
      const response = await api.get("/orders", { params });
      return response;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, orderStatus, paymentStatus }) => {
      const response = await api.put(`/orders/${id}/status`, {
        orderStatus,
        paymentStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
  });
}

export default useMyOrders;
