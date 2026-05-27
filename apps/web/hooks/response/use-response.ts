import { trpc } from "@/trpc/client";

export const useGetFormResponse = (formId: string) => {
  const { data, error, isLoading } = trpc.response.getFormResponses.useQuery({ formId });

  return {
    data,
    error,
    isLoading,
  };
};

export const useSubmitFormResponses = () => {
  const utils = trpc.useUtils();

  const submitResponsesMutation = trpc.response.create.useMutation({
    onSuccess: (data) => {
      utils.response.invalidate();
    },
    onError: (error) => {
      console.error("Failed to submit responses:", error.message);
    },
  });

  return {
    submitResponsesMutation,
    isSubmitting: submitResponsesMutation.isPending,
    error: submitResponsesMutation.error,
  };
};
