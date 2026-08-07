import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useCollection = (idOrSlug) => {
  return useQuery({
    queryKey: ["collection", idOrSlug],
    queryFn: async () => {
      const response = await api.get(`/collections/${idOrSlug}`);
      return response.data || response;
    },
    enabled: !!idOrSlug,
  });
};

export default useCollection;
