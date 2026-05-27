import { trpc } from "@/trpc/client";

export const useFormAnalytics = () => {
  const { data, error, isLoading } = trpc.analytics.getFormAnalytics.useQuery();

  return {
    data,
    error,
    isLoading,
  };
};

export const useDashboardAnalytics = ()=>{
  const {data, error, isLoading} = trpc.analytics.getDashboardAnalytics.useQuery()

  return {
    data,
    error,
    isLoading
  }
}
