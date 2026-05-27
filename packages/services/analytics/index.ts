import db, { eq, sql, count } from "@repo/database";
import { formsTable, formResponsesTable, usersTable } from "@repo/database/schema";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";

const getFormAnalytics = async (userId: string) => {
  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  const dbUserId = dbUser?.id as string;

  const responsesPerForm = await db
    .select({
      formTitle: formsTable.title,
      responseCount: count(formResponsesTable.id).mapWith(Number),
    })
    .from(formsTable)
    .leftJoin(formResponsesTable, eq(formsTable.id, formResponsesTable.formId))
    .where(eq(formsTable.createdBy, dbUserId))
    .groupBy(formsTable.id, formsTable.title);

  const responsesOverTime = await db
    .select({
      date: sql<string>`DATE(${formResponsesTable.createdAt})`.as("date"),
      count: count(formResponsesTable.id).mapWith(Number),
    })
    .from(formResponsesTable)
    .leftJoin(formsTable, eq(formsTable.id, formResponsesTable.formId))
    .where(eq(formsTable.createdBy, dbUserId))
    .groupBy(sql`DATE(${formResponsesTable.createdAt})`)
    .orderBy(sql`DATE(${formResponsesTable.createdAt}) ASC`);

  return { responsesPerForm, responsesOverTime };
};

const getDashboardAnalytics = async (userId: string) => {
  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, userId));

  if (!user) throwTRPCError("NOT_FOUND", "User not found");

  const analyticsResult = await db
    .select({
      totalForms: count(formsTable.id),
      publicForms: sql<number>`COUNT(*) FILTER (WHERE ${formsTable.visibility} = 'public')`,
      totalResponses: count(formResponsesTable.id),

      completionRate: sql<number>`COALESCE(
        ROUND(
          (COUNT(DISTINCT CASE WHEN ${formResponsesTable.id} IS NOT NULL THEN ${formResponsesTable.id} END)::numeric / 
           NULLIF(COUNT(DISTINCT ${formsTable.id}), 0)) * 100, 
        0), 0)`,
    })
    .from(formsTable)
    .leftJoin(formResponsesTable, eq(formsTable.id, formResponsesTable.formId))
    .where(eq(formsTable.createdBy, user.id));

  return (
    analyticsResult[0] || {
      totalForms: 0,
      publicForms: 0,
      totalResponses: 0,
      completionRate: 0,
    }
  );
};

export { getFormAnalytics, getDashboardAnalytics };
