import db, { eq, and, gte, sql } from "@repo/database";
import {
  formsTable,
  formResponsesTable,
  responseAnswersTable,
  formFieldsTable,
  usersTable,
} from "@repo/database/schema";
import { z } from "zod";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";

const getGlobalFormAnalytics = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  if (!dbUser) {
    throwTRPCError("NOT_FOUND", "User not found");
  }

  const dbUserId = dbUser.id;

  const [formStats, totalResponsesCount, responsesOverTime, weeklyActivity] = await Promise.all([
    // Multi-metric aggregation: Get total forms & total published forms for this user in one sweep
    db
      .select({
        totalForms: sql<number>`count(${formsTable.id})::int`,
        publishedForms: sql<number>`count(case when ${formsTable.isPublished} = true then 1 end)::int`,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, dbUserId)),

    // Aggregate Total Form Responses across ALL of this user's forms
    db
      .select({
        count: sql<number>`count(${formResponsesTable.id})::int`,
      })
      .from(formResponsesTable)
      .innerJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formsTable.createdBy, dbUserId)),

    // Line Chart: Total responses across all forms grouped on exact calendar days
    db
      .select({
        dateStr: sql<string>`to_char(${formResponsesTable.submittedAt}, 'Mon DD')`,
        count: sql<number>`count(${formResponsesTable.id})::int`,
      })
      .from(formResponsesTable)
      .innerJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formsTable.createdBy, dbUserId))
      .groupBy(
        sql`to_char(${formResponsesTable.submittedAt}, 'Mon DD')`,
        sql`date_trunc('day', ${formResponsesTable.submittedAt})`,
      )
      .orderBy(sql`date_trunc('day', ${formResponsesTable.submittedAt})`),

    // Weekly Activity Bar Chart: Submissions tracked over trailing 7 days across all user forms
    db
      .select({
        dayName: sql<string>`to_char(${formResponsesTable.submittedAt}, 'Dy')`,
        count: sql<number>`count(${formResponsesTable.id})::int`,
      })
      .from(formResponsesTable)
      .innerJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
      .where(
        and(eq(formsTable.createdBy, dbUserId), gte(formResponsesTable.submittedAt, sevenDaysAgo)),
      )
      .groupBy(
        sql`to_char(${formResponsesTable.submittedAt}, 'Dy')`,
        sql`extract(dow from ${formResponsesTable.submittedAt})`,
      )
      .orderBy(sql`extract(dow from ${formResponsesTable.submittedAt})`),
  ]);

  // 2. Parse top-level card metrics safely
  const totalForms = formStats[0]?.totalForms || 0;
  const totalPublishedForms = formStats[0]?.publishedForms || 0;
  const totalResponses = totalResponsesCount[0]?.count || 0;

  // 3. Format Responses Over Time Dataset (Line Chart interface mapping)
  const responsesOverTimeData = responsesOverTime.map((item) => ({
    date: item.dateStr,
    submissions: item.count,
  }));

  // 4. Format Weekly Activity Dataset (Bar Chart map layout framework)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityMap = new Map<string, number>(dayLabels.map((day) => [day, 0]));

  weeklyActivity.forEach((item) => {
    if (activityMap.has(item.dayName)) {
      activityMap.set(item.dayName, item.count);
    }
  });

  const weeklyActivityData = dayLabels.map((day) => ({
    day,
    count: activityMap.get(day) || 0,
  }));

  // 5. Return global dashboard payload
  return {
    cards: {
      totalForms,
      totalPublishedForms,
      totalResponses,
    },
    charts: {
      responsesOverTime: responsesOverTimeData,
      weeklyActivity: weeklyActivityData,
    },
  };
};

export { getGlobalFormAnalytics };
