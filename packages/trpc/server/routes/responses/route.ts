import { responseService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

import {
  createResponseInputModel,
  createResponseOutputModel,
  getFormResponseInputModel,
  getFormResponseOutputModel,
} from "./model";

const TAGS = ["Responses"];

export const responseRouter = router({
  create: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/forms/{formId}/responses",
        tags: TAGS,
        summary: "Submit form response",
      },
    })
    .input(createResponseInputModel)
    .output(createResponseOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, answer } = input;
      const { ipAddress } = ctx;

      const result = await responseService.createResponse({
        formId,
        ipAddress,
        answer,
      });

      return result;
    }),

  getFormResponses: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms/{formId}/responses",
        tags: TAGS,
        summary: "Get form responses",
      },
    })
    .input(getFormResponseInputModel)
    .output(getFormResponseOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;

      const result = await responseService.getFormResponse({
        formId,
      });

      return result;
    }),
});
