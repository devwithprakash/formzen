import { formFieldService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  updateBatchFormFieldsInputModel,
  updateBatchFormFieldsOutputModel,
} from "../form-field/model";

const TAGS = ["Form Fields"];
const getPath = generatePath("/form-field");

export const formFieldRouter = router({
  // single route form create, update and delete
  sync: publicProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/sync"),
        tags: TAGS,
      },
    })
    .input(updateBatchFormFieldsInputModel)
    .output(updateBatchFormFieldsOutputModel)
    .mutation(async ({ input }) => {
      return await formFieldService.updateFormFieldsBatch(input);
    }),
});
