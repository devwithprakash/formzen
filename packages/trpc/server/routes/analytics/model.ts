import { z } from "zod";

export const getFormAnalyticsInputModel = z.object({
  formId: z.string(),
});

export const getFormAnalyticsOutputModel = z.object({
  responsesPerForm: z.array(
    z.object({
      formTitle: z.string(),
      responseCount: z.number(),
    }),
  ),
  responsesOverTime: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    }),
  ),
});

export const getDashboardAnalyticsOutputModel = z.object({
  totalForms: z.coerce.number(),
  publicForms: z.coerce.number(),
  totalResponses: z.coerce.number(),
  completionRate: z.coerce.number(),
});
