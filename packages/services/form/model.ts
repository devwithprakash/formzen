import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().describe("title of the form"),
  description: z.string().describe("description of the form").nullable().optional(),
  theme: z.enum(["light", "dark", "minimal", "gradient", "modern"]),
});

export const updateFormInput = z.object({
  formId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  theme: z.enum(["light", "dark", "minimal", "gradient", "modern"]),
  isPublished: z
    .preprocess((val) => {
      if (typeof val !== "boolean") {
        return undefined;
      }

      return val;
    }, z.boolean())
    .optional(),
});

export const deleteFormInput = z.object({
  formId: z.string().describe("id of the form"),
});

export const getFormByIdInput = z.object({
  formId: z.string().describe("id of the form"),
});

export const getSingleFormDetailsInput = z.object({
  formId: z.string().describe("id of the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
export type UpdateFormInputType = z.infer<typeof updateFormInput>;
export type DeleteFormInputType = z.infer<typeof deleteFormInput>;
export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;
export type GetSingleFormDetailsInputType = z.infer<typeof getSingleFormDetailsInput>;
