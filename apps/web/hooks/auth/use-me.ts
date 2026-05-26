import { trpc } from "@/trpc/client";

export function useMe() {
  const utils = trpc.useUtils();

  const { mutateAsync, isPending, error, data } = trpc.auth.me.useMutation({
    onSuccess: () => {
      utils.auth.invalidate();
    },
  });

  const getMe = async () => {
    try {
      return await mutateAsync();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    me: data,
    getMe,
    isLoading: isPending,
    error,
  };
}
