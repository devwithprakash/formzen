import { analyticsService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { getDashboardAnalyticsOutputModel, getFormAnalyticsOutputModel } from "./model";

const TAGS = ["Analytics"];

export const analyticsRouter = router({
  getFormAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/forms",
        tags: TAGS,
        summary: "Get analytics for all forms",
      },
    })
    .output(getFormAnalyticsOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      return await analyticsService.getFormAnalytics(userId);
    }),

  getDashboardAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/dashboard",
        tags: TAGS,
        summary: "Get dashboard analytics overview",
      },
    })
    .output(getDashboardAnalyticsOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      return await analyticsService.getDashboardAnalytics(userId);
    }),
});
