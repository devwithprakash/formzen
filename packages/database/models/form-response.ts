import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { relations } from "drizzle-orm";
import { responseAnswersTable } from "./response-answer";

export const formResponsesTable = pgTable("form_responses", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, {
      onDelete: "cascade",
    }),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),

  ipAddress: text("ip_address").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const formResponsesRelations = relations(formResponsesTable, ({ many }) => ({
  answers: many(responseAnswersTable), 
}));
