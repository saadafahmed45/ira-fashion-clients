import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await api.get("/collections");
      return response.data; // returns array of collections
    },
  });
};

export default useCollections;
