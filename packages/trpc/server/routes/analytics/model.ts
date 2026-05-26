import { z } from "zod";

export const getFormAnalyticsInputModel = z.object({
  formId: z.string(),
});

export const getGlobalFormAnalyticsOutputModel = z.object({
  cards: z.object({
    totalForms: z.number(),
    totalPublishedForms: z.number(),
    totalResponses: z.number(),
  }),
  charts: z.object({
    responsesOverTime: z.array(
      z.object({
        date: z.string(),
        submissions: z.number(),
      })
    ),
    weeklyActivity: z.array(
      z.object({
        day: z.string(),
        count: z.number(),
      })
    ),
  }),
});

