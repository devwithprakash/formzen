import { z } from "zod";

// field options type
export const formFieldTypeEnum = z.enum([
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
]);

export const formFieldOptionInputModel = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

export const formFieldOptionOutputModel = z.object({
  id: z.string(),
  fieldId: z.string(),
  label: z.string(),
  value: z.string(),
  order: z.number().int(),
});

// field input schema
export const syncFormFieldItemInputModel = z.object({
  id: z.string().optional(),
  formId: z.string(),
  label: z.string().min(1).max(100),
  type: formFieldTypeEnum,
  required: z.boolean().optional().default(false),
  order: z.number().int().min(0),

  // nullable and options fields
  placeholder: z.string().max(100).nullable().optional(),
  helperText: z.string().max(200).nullable().optional(),
  minLength: z.number().int().min(0).nullable().optional(),
  maxLength: z.number().int().min(1).nullable().optional(),
  minValue: z.number().nullable().optional(),
  maxValue: z.number().nullable().optional(),

  options: z.array(formFieldOptionInputModel).optional(),
});

// main input validator
export const updateBatchFormFieldsInputModel = z.array(syncFormFieldItemInputModel);

// fields output schema
export const syncFormFieldItemOutputModel = z.object({
  id: z.string(),
  formId: z.string(),
  label: z.string(),
  type: formFieldTypeEnum,
  required: z.boolean(),
  order: z.number().int(),

  // Database returns explicit nulls rather than undefined for empty rows
  placeholder: z.string().nullable(),
  helperText: z.string().nullable(),
  minLength: z.number().int().nullable(),
  maxLength: z.number().int().nullable(),
  minValue: z.number().nullable(),
  maxValue: z.number().nullable(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  options: z.array(formFieldOptionOutputModel),
});

// main output validator
export const updateBatchFormFieldsOutputModel = z.array(syncFormFieldItemOutputModel);

export type SyncFormFieldItemInput = z.infer<typeof syncFormFieldItemInputModel>;
export type SyncFormFieldItemOutput = z.infer<typeof syncFormFieldItemOutputModel>;
