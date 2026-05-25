import db, { InferSelectModel } from "@repo/database";
import { submitResponseInput, SubmitResponseInputType } from "./model";
import { formResponsesTable, responseAnswersTable } from "@repo/database/schema";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";

type ResponseAnswer = InferSelectModel<typeof responseAnswersTable>;

const createResponse = async (payload: SubmitResponseInputType) => {
  const { formId, ipAddress, answer } = await submitResponseInput.parseAsync(payload);

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

export { createResponse };
