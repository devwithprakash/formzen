import { z } from "zod";

export const formFieldOptionInput = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

export const createFormFieldInput = z.object({
  formId: z.string(),
  label: z.string().min(1).max(100),

  type: z.enum([
    "text",
    "textarea",
    "email",
    "number",
    "phone",
    "select",
    "radio",
    "checkbox",
    "date",
    "file",
  ]),

  required: z.boolean().optional().default(false),
  order: z.number().int().min(0),

  placeholder: z.string().max(100).optional(),
  helperText: z.string().max(200).optional(),

  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),

  minValue: z.number().optional(),
  maxValue: z.number().optional(),

  options: z.array(formFieldOptionInput).optional(),
});

export const createFormFieldBatchInput = z.array(createFormFieldInput);

export const batchFormFieldOptionInput = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

// This matches a SINGLE item in the canvas array
export const updateBatchFormFieldItemInput = z.object({
  id: z.string().optional(),
  formId: z.string(),
  label: z.string().min(1).max(100),
  type: z.enum([
    "text",
    "textarea",
    "email",
    "number",
    "phone",
    "select",
    "radio",
    "checkbox",
    "date",
    "file",
  ]),
  required: z.boolean().optional().default(false),
  order: z.number().int().min(0),
  placeholder: z.string().max(100).nullable().optional(),
  helperText: z.string().max(200).nullable().optional(),
  minLength: z.number().int().min(0).nullable().optional(),
  maxLength: z.number().int().min(1).nullable().optional(),
  minValue: z.number().nullable().optional(),
  maxValue: z.number().nullable().optional(),
  options: z.array(batchFormFieldOptionInput).optional(),
});

// 🌟 ADD THIS LINE: This wraps your item schema so it expects an ARRAY [item, item, ...]
export const updateBatchFormFieldsInput = z.array(updateBatchFormFieldItemInput);

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;
export type CreateFormFieldBatchInputType = z.infer<typeof createFormFieldBatchInput>;
export type UpdateBatchFormFieldInputType = z.infer<typeof updateBatchFormFieldsInput>;
