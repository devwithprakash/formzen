import { trpc } from "@/trpc/client";

export const useGetFormResponse = (formId: string) => {
  const { data, error, isLoading } = trpc.response.getFormResponses.useQuery({ formId });

  return {
    data,
    error,
    isLoading,
  };
};
