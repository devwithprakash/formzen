import { trpc } from "@/trpc/client";

export const useGlobalAnalytics = () => {
  const { data, error, isLoading } = trpc.analytics.getAnalytics.useQuery();

  return {
    data,
    error,
    isLoading,
  };
};
