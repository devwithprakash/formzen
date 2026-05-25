import { string, z } from "zod";

const reponseAnswerInput = z.object({
  fieldId: z.string(),
  value: z.string(),
});

export const submitResponseInput = z.object({
  formId: z.string(),
  ipAddress: z.string(),
  answer: z.array(reponseAnswerInput),
});

export type SubmitResponseInputType = z.infer<typeof submitResponseInput>;
