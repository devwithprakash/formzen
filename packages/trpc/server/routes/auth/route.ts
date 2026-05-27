import { userService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { userOutputModel } from "./model";

const TAGS = ["Auth"];

export const authRouter = router({
  me: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/me",
        tags: TAGS,
        summary: "Get current authenticated user",
      },
    })
    .output(userOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      return await userService.upsertUserByClerkId({
        clerkUserId: userId,
      });
    }),
});
