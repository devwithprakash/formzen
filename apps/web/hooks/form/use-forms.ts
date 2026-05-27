import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export interface FormRecord {
  id: string;
  title: string;
  description: string | null;
  theme: "light" | "dark" | "minimal" | "gradient" | "modern";
  visibility: "private" | "public" | "unlisted";
  slug: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  formFields?: any[];
}

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const router = useRouter();

  const createFormMutation = trpc.form.create.useMutation({
    onSuccess: (data) => {
      utils.form.invalidate();
      if (data?.id) {
        router.push(`/dashboard/forms/${data.id}/builder`);
      }
    },
    onError: (err) => {
      console.error("Failed to create form:", err.message);
    },
  });

  const submitForm = async (title: string, description: string, theme: string) => {
    return await createFormMutation.mutateAsync({
      title,
      description,
      theme: theme as "light" | "dark" | "minimal" | "gradient",
    });
  };

  return {
    submitForm,
    isLoading: createFormMutation.isPending,
  };
};

export const useGetForm = (
  formId: string,
): {
  form: FormRecord | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
} => {
  const { data, isLoading, error, refetch } = trpc.form.getById.useQuery({ formId });

  return {
    form: data as FormRecord | undefined,
    isLoading,
    error,
    refetch: refetch as any,
  };
};

export const useGetAllForms = () => {
  const { data, isLoading, error } = trpc.form.getAll.useQuery();

  return {
    data,
    isLoading,
    error,
  };
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();

  const updateFormMutation = trpc.form.update.useMutation({
    onSuccess: (data) => {
      utils.form.invalidate();
    },

    onError: (error) => {
      console.error("Failed to update form:", error.message);
    },
  });

  return {
    updateFormMutation,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();

  const deleteMutation = trpc.form.delete.useMutation({
    onSuccess: (data) => {
      utils.form.invalidate();

    },
    onError: (error) => {
      console.error("Failed to delete form:", error.message);
    },
  });

  return {
    deleteMutation,
  };
};

export const useGetFormBySlug = (slug: string) => {
  const { data, error, isLoading } = trpc.form.getBySlug.useQuery({ slug });

  return {
    data,
    error,
    isLoading,
  };
};

export const useGetAllPublicForms = () => {
  const { data, error, isLoading } = trpc.form.listPublic.useQuery();

  return {
    data,
    error,
    isLoading,
  };
};
