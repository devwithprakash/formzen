import { z } from "zod";

const reponseAnswerInput = z.object({
  fieldId: z.string(),
  value: z.string(),
});

export const createResponseInputModel = z.object({
  formId: z.string(),
  ipAddress: z.string(),
  answer: z.array(reponseAnswerInput),
});

const responseAnswerOutputModel = z.object({
  id: z.string(),
  responseId: z.string(),
  fieldId: z.string(),
  value: z.string(),
});

export const createResponseOutputModel = z.object({
  id: z.string(),
  formId: z.string(),
  submittedAt: z.date(),
  ipAddress: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  answers: z.array(responseAnswerOutputModel),
});
