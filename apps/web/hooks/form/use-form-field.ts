import { trpc } from "@/trpc/client";

export const useSyncFormFields = () => {
  const utils = trpc.useUtils();

  const syncFieldsMutation = trpc.formField.sync.useMutation({
    onSuccess: (data) => {
      utils.formField.invalidate();

    },
    
    onError: (err) => {
      console.error("Failed to save form configuration:", err.message);
    },
  });

  return {
    syncFieldsMutation,
  };
};
