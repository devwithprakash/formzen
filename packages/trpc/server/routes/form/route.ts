import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  createFormInputModel,
  createFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  getAllFormsOutputModel,
  getAllPublicFormOutputModel,
  getFormByIdInputModel,
  getFormByIdOutputModel,
  getFormBySlugInputModel,
  getFormBySlugOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
} from "./model";

import { formService } from "../../services";

const TAGS = ["Forms"];

export const formRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/forms",
        tags: TAGS,
        summary: "Create form",
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { title, description, theme } = input;

      const result = await formService.createForm({ title, description, theme }, userId);

      return result;
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/forms/{formId}",
        tags: TAGS,
        summary: "Update form",
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { formId, ...data } = input;

      const result = await formService.updateForm({ formId, ...data }, userId);

      return result;
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/forms/{formId}",
        tags: TAGS,
        summary: "Delete form",
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { formId } = input;

      const result = await formService.deleteForm({ formId }, userId);

      return result;
    }),

  getAll: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms",
        tags: TAGS,
        summary: "Get all forms",
      },
    })
    .output(getAllFormsOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const result = await formService.getAllForms(userId);

      return result;
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms/{formId}",
        tags: TAGS,
        summary: "Get form by id",
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { formId } = input;

      return await formService.getFormById({ formId }, userId);
    }),

  listPublic: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/public/forms",
        tags: ["Public Forms"],
        summary: "Get all public forms",
      },
    })
    .output(getAllPublicFormOutputModel)
    .query(async () => {
      return await formService.getAllPublicForms();
    }),

  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/public/forms/{slug}",
        tags: ["Public Forms"],
        summary: "Get public form by slug",
      },
    })
    .input(getFormBySlugInputModel)
    .output(getFormBySlugOutputModel)
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      const { ipAddress } = ctx;

      return await formService.getFormBySlug({ slug }, ipAddress ?? null);
    }),
});
