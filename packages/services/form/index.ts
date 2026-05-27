import db, { and, count, eq, like } from "@repo/database";
import {
  createFormInput,
  CreateFormInputType,
  deleteFormInput,
  DeleteFormInputType,
  getFormBySlugInput,
  GetFormBySlugInputType,
  getSingleFormDetailsInput,
  GetSingleFormDetailsInputType,
  updateFormInput,
  UpdateFormInputType,
} from "./model";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";

import { formsTable } from "@repo/database/models/form";
import { usersTable } from "@repo/database/models/user";
import { formResponsesTable } from "@repo/database/schema";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

async function getUniqueSlug(title: string): Promise<string> {
  const base = generateSlug(title);

  // Fetch all existing slugs with the same base in one query
  const existing = await db
    .select({ slug: formsTable.slug })
    .from(formsTable)
    .where(like(formsTable.slug, `${base}%`));

  if (existing.length === 0) return base;

  const existingSet = new Set(existing.map((r) => r.slug));

  if (!existingSet.has(base)) return base;

  let counter = 1;
  while (existingSet.has(`${base}-${counter}`)) {
    counter++;
  }

  return `${base}-${counter}`;
}

const createForm = async (payload: CreateFormInputType, userId: string) => {
  const { title, description, theme } = await createFormInput.parseAsync(payload);

  const dbUser = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  const user = dbUser[0];

  if (!user) {
    throw new Error("User not found");
  }

  const uniqueSlug = await getUniqueSlug(title);

  const form = await db
    .insert(formsTable)
    .values({
      title,
      slug: uniqueSlug,
      description,
      createdBy: user.id,
      theme,
    })
    .returning();

  if (!form[0] || form.length === 0) {
    throw new Error("Failed to create form");
  }

  return form[0];
};

const updateForm = async (payload: UpdateFormInputType, userId: string) => {
  const { formId, title, description, isPublished, theme, visibility } =
    await updateFormInput.parseAsync(payload);

  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  if (!dbUser) {
    throwTRPCError("NOT_FOUND", "User not found");
  }

  const result = await db
    .update(formsTable)
    .set({
      title,
      description,
      isPublished,
      theme,
      visibility,
      updatedAt: new Date(),
    })
    .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, dbUser.id)))
    .returning();

  const updatedForm = result[0];

  if (!updatedForm) {
    throwTRPCError("NOT_FOUND", "Form not found or you do not have permission to update it");
  }

  return updatedForm;
};

const deleteForm = async (payload: DeleteFormInputType, userId: string) => {
  const { formId } = await deleteFormInput.parseAsync(payload);

  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  if (!dbUser) {
    throwTRPCError("NOT_FOUND", "User not found");
  }

  const result = await db
    .delete(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, dbUser.id)))
    .returning();

  const deletedForm = result[0];

  if (!deletedForm) {
    throwTRPCError("NOT_FOUND", "Form not found");
  }

  return deletedForm;
};

const getAllForms = async (userId: string) => {
  const dbUser = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));
  const user = dbUser[0];

  if (!user) {
    throwTRPCError("NOT_FOUND", "User not found");
  }

  const result = await db
    .select({
      form: formsTable,
      responseCount: count(formResponsesTable.id),
    })
    .from(formsTable)
    .leftJoin(formResponsesTable, eq(formsTable.id, formResponsesTable.formId))
    .where(eq(formsTable.createdBy, user.id))
    .groupBy(formsTable.id);

  return result.map(({ form, responseCount }) => ({
    ...form,
    responseCount,
  }));
};

const getFormById = async (payload: GetSingleFormDetailsInputType, userId: string) => {
  const { formId } = await getSingleFormDetailsInput.parseAsync(payload);

  const dbUser = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

  const user = dbUser[0];

  if (!user) {
    throwTRPCError("NOT_FOUND", "User not found");
  }

  const form = await db.query.formsTable.findFirst({
    where: and(eq(formsTable.id, formId), eq(formsTable.createdBy, user.id)),
    with: {
      formFields: {
        with: {
          fieldOptions: true,
        },
      },
    },
  });

  if (!form) {
    throwTRPCError("NOT_FOUND", "Form not found");
  }

  return form;
};

const getAllPublicForms = async () => {
  const result = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.visibility, "public" as any));

  return result;
};

const getFormBySlug = async (payload: GetFormBySlugInputType, ipAddress: string) => {
  const { slug } = await getFormBySlugInput.parseAsync(payload);

  const form = await db.query.formsTable.findFirst({
    where: eq(formsTable.slug, slug),
    with: {
      formFields: {
        with: { fieldOptions: true },
      },
    },
  });

  if (!form) {
    throwTRPCError("NOT_FOUND", "The requested form could not be located.");
  }

  const [existingResponse] = await db
    .select()
    .from(formResponsesTable)
    .where(
      and(eq(formResponsesTable.formId, form.id), eq(formResponsesTable.ipAddress, ipAddress)),
    );

  if (existingResponse) {
    throwTRPCError("BAD_REQUEST", "You have already submitted this form.");
  }

  if (form.visibility === "private") {
    throwTRPCError("FORBIDDEN", "This form is not currently accepting responses");
  }

  return form;
};

export {
  createForm,
  updateForm,
  deleteForm,
  getAllForms,
  getFormById,
  getAllPublicForms,
  getFormBySlug,
};
