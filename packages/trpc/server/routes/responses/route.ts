import { responseService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createResponseInputModel, createResponseOutputModel } from "./model";

const TAGS = ["Response"];
const getPath = generatePath("/response");

export const responseRouter = router({
  create: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
      },
    })
    .input(createResponseInputModel)
    .output(createResponseOutputModel)
    .mutation(async ({ input }) => {
      const { formId, ipAddress, answer } = input;

      const result = await responseService.createResponse({ formId, ipAddress, answer });

      return result;
    }),
});
