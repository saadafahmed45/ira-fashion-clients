import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["categories", { includeInactive }],
    queryFn: async () => {
      const response = await api.get("/categories", {
        params: { includeInactive: includeInactive ? "true" : "false" },
      });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(slugOrId) {
  return useQuery({
    queryKey: ["category", slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      const response = await api.get(`/categories/${slugOrId}`);
      return response.data;
    },
    enabled: !!slugOrId,
  });
}

export default useCategories;
