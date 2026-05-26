import { z } from "zod";

export const formAnalyticsInput = z.object({
  formId: z.string(),
});

export type FormAnalyticsInputType = z.infer<typeof formAnalyticsInput>;
