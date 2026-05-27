import { trpc } from "@/trpc/client";

export function useMe() {
  const { data, isLoading, error } = trpc.auth.me.useQuery();

  return {
    me: data,
    isLoading,
    error,
  };
}
