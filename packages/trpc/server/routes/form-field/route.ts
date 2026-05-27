import { formFieldService } from "../../services";
import { protectedProcedure, router } from "../../trpc";

import {
  updateBatchFormFieldsInputModel,
  updateBatchFormFieldsOutputModel,
} from "../form-field/model";

const TAGS = ["Form Fields"];

export const formFieldRouter = router({
  sync: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/forms/{formId}/fields",
        tags: TAGS,
        summary: "Sync form fields",
      },
    })
    .input(updateBatchFormFieldsInputModel)
    .output(updateBatchFormFieldsOutputModel)
    .mutation(async ({ input }) => {
      return await formFieldService.updateFormFieldsBatch(input);
    }),
});
