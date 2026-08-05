import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetch on focus for better UX
      retry: 1, // retry once on failure
      staleTime: 5 * 60 * 1000, // cache stale time of 5 minutes
    },
  },
});

export default queryClient;
