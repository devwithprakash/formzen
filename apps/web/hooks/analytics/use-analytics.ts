import { trpc } from "@/trpc/client";

export const useFormAnalytics = () => {
  const { data, error, isLoading } = trpc.analytics.getFormAnalytics.useQuery();

  console.log(data)

  return {
    data,
    error,
    isLoading,
  };
};

export const useDashboardAnalytics = ()=>{
  const {data, error, isLoading} = trpc.analytics.getDashboardAnalytics.useQuery()

  console.log(data)

  return {
    data,
    error,
    isLoading
  }
}
