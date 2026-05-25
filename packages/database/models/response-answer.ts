import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formResponsesTable } from "./form-response";
import { formFieldsTable } from "./form-field";

export const responseAnswersTable = pgTable("response_answers", {
  id: uuid("id").defaultRandom().primaryKey(),

  responseId: uuid("response_id")
    .notNull()
    .references(() => formResponsesTable.id, {
      onDelete: "cascade",
    }),

  fieldId: uuid("field_id")
    .notNull()
    .references(() => formFieldsTable.id, {
      onDelete: "cascade",
    }),

  value: text("value").notNull()

});
