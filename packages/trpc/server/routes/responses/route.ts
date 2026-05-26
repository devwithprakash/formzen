import { getFormResponseInput } from "@repo/services/responses/model";
import { responseService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createResponseInputModel,
  createResponseOutputModel,
  getFormResponseInputModel,
  getFormResponseOutputModel,
} from "./model";

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
    .mutation(async ({ input, ctx }) => {
      const ipAddress = ctx.ipAddress;
      const { formId, answer } = input;

      const result = await responseService.createResponse({ formId, ipAddress, answer });

      return result;
    }),
  getFormResponses: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get-response"),
        tags: TAGS,
      },
    })
    .input(getFormResponseInputModel)
    .output(getFormResponseOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;

      const result = await responseService.getFormResponse({ formId });

      return result;
    }),
});
