
import { trpc } from "@/trpc/client";

export const useSubmitFormResponses = () => {
  const utils = trpc.useUtils();

  const submitResponsesMutation = trpc.response.create.useMutation({
    onSuccess: (data) => {
      utils.response.invalidate();
      console.log("Submission successful:", data);
    },
    onError: (error) => {
      console.log(error.message)
      console.error("Failed to submit responses:", error.message);
    },
  });

  return {
    submitResponsesMutation,
    isSubmitting: submitResponsesMutation.isPending,
    error: submitResponsesMutation.error
  };
};
