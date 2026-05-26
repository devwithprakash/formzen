import { analyticsService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { getGlobalFormAnalyticsOutputModel } from "./model";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

export const analyticsRouter = router({
  getAnalytics: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get/"),
        tags: TAGS,
      },
    })
    .output(getGlobalFormAnalyticsOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const result = await analyticsService.getGlobalFormAnalytics(userId);

      return result;
    }),
});
