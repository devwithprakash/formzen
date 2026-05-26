import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  getAllFormsOutputModel,
  getFormBySlugInputModel,
  getFormBySlugOutputModel,
  getSingleFormDetailsInputModel,
  getSingleFormDetailsOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
} from "./model";
import { formService } from "../../services";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const { title, description, theme } = input;

      const form = await formService.createForm({ title, description, theme }, userId);

      return form;
    }),

  update: publicProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/update"),
        tags: TAGS,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ input }) => {
      const { formId, title, description, isPublished, theme } = input;

      const updatedForm = await formService.updateForm({
        formId,
        title,
        description,
        isPublished,
        theme,
      });

      return updatedForm;
    }),

  delete: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/delete/{formId}"),
        tags: TAGS,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input }) => {
      const { formId } = input;

      const deletedForm = await formService.deleteForm({ formId });

      return deletedForm;
    }),

  getAll: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get"),
        tags: TAGS,
      },
    })
    .output(getAllFormsOutputModel)
    .query(async ({ ctx }) => {
      const userId = ctx.userId;

      const result = await formService.getAllForms(userId);

      return result;
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get/{formId}"),
        tags: TAGS,
      },
    })
    .input(getSingleFormDetailsInputModel)
    .output(getSingleFormDetailsOutputModel)
    .query(async ({ input, ctx }) => {
      const { formId } = input;

      const userId = ctx.userId;

      const form = await formService.getSingleFormDetails({ formId }, userId);

      return form;
    }),

  getAllPublicForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/form-list"),
        tags: TAGS,
      },
    })
    .output(getAllFormsOutputModel)
    .query(async () => {
      const result = await formService.getAllPublicForms();

      return result;
    }),

  getFormBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/get/{slug}"),
      },
    })
    .input(getFormBySlugInputModel)
    .output(getFormBySlugOutputModel)
    .query(async ({ input, ctx }) => {
      const {ipAddress} = ctx
      const { slug } = input;

      const form = await formService.getFormBySlug({ slug }, ipAddress);

      return form;
    }),
});
