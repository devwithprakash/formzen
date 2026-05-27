import db, { and, eq, InferSelectModel } from "@repo/database";
import {
  getFormResponseInput,
  GetFormResponseInputType,
  submitResponseInput,
  SubmitResponseInputType,
} from "./model";
import { formFieldsTable, formResponsesTable, responseAnswersTable } from "@repo/database/schema";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";

type ResponseAnswer = InferSelectModel<typeof responseAnswersTable>;

const createResponse = async (payload: SubmitResponseInputType) => {
  const { formId, ipAddress, answer } = await submitResponseInput.parseAsync(payload);

  const [existingResponse] = await db
    .select()
    .from(formResponsesTable)
    .where(and(eq(formResponsesTable.formId, formId), eq(formResponsesTable.ipAddress, ipAddress)));

  if (existingResponse) {
    throwTRPCError("BAD_REQUEST", "You have already submitted this response for this form.");
  }
  const [insertedResponse] = await db
    .insert(formResponsesTable)
    .values({
      formId,
      ipAddress,
      submittedAt: new Date(),
    })
    .returning();

  if (!insertedResponse) {
    throwTRPCError("INTERNAL_SERVER_ERROR", "Failed to create response");
  }

  let responseAnswer: ResponseAnswer[] = [];

  if (answer.length > 0) {
    responseAnswer = await db.transaction(async (tx) => {
      return await tx
        .insert(responseAnswersTable)
        .values(
          answer.map((ans) => ({
            responseId: insertedResponse.id,
            fieldId: ans.fieldId,
            value: ans.value,
          })),
        )
        .returning();
    });
  }

  return { ...insertedResponse, answers: responseAnswer };
};

const getFormResponse = async (payload: GetFormResponseInputType) => {
  const { formId } = await getFormResponseInput.parseAsync(payload);

  const fields = await db
    .select()
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, formId))
    .orderBy(formFieldsTable.order);

  const responses = await db.query.formResponsesTable.findMany({
    where: eq(formResponsesTable.formId, formId),
    orderBy: (responses, { desc }) => [desc(responses.submittedAt)],
    with: {
      answers: true,
    },
  });

  return {
    fields,
    responses,
  };
};

export { createResponse, getFormResponse };
