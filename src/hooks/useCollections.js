import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useCollections = (params = {}) => {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: async () => {
      const response = await api.get("/collections", { params });
      return response.data || response;
    },
  });
};

export default useCollections;
