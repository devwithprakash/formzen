import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

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
