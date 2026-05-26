import { trpc } from "@/trpc/client";

export const useSyncFormFields = () => {
  const utils = trpc.useUtils();

  const syncFieldsMutation = trpc.formField.sync.useMutation({
    onSuccess: (data) => {
      utils.formField.invalidate();
      console.log("Configuration synced successfully:", data);
    },
    
    onError: (err) => {
      console.error("Failed to save form configuration:", err.message);
    },
  });

  return {
    syncFieldsMutation,
  };
};
