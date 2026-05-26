import db, { and, eq, like } from "@repo/database";
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

import { formsTable, formsRelations } from "@repo/database/models/form";
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

const updateForm = async (payload: UpdateFormInputType) => {
  const { formId, title, description, isPublished, theme } =
    await updateFormInput.parseAsync(payload);

  const result = await db
    .update(formsTable)
    .set({
      title,
      description,
      isPublished,
      theme,
    })
    .where(eq(formsTable.id, formId))
    .returning();

  const updatedForm = result[0];

  if (!updatedForm) {
    throwTRPCError("NOT_FOUND", "Form not found");
  }

  return updatedForm;
};

const deleteForm = async (payload: DeleteFormInputType) => {
  const { formId } = await deleteFormInput.parseAsync(payload);

  const result = await db.delete(formsTable).where(eq(formsTable.id, formId)).returning();

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

  const result = await db.select().from(formsTable).where(eq(formsTable.createdBy, user.id));

  return result;
};

const getSingleFormDetails = async (payload: GetSingleFormDetailsInputType, userId: string) => {
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
  const result = await db.select().from(formsTable).where(eq(formsTable.isPublished, true));

  return result;
};

const getFormBySlug = async (payload: GetFormBySlugInputType, ipAddress: string) => {
  const { slug } = await getFormBySlugInput.parseAsync(payload);

  const [existingResponse] = await db.select().from(formResponsesTable).where(eq(formResponsesTable.ipAddress, ipAddress))

  if(existingResponse){
    throwTRPCError("BAD_REQUEST", "User already submitted the form")
  }



  const form = await db.query.formsTable.findFirst({
    where: and(eq(formsTable.slug, slug)),
    with: {
      formFields: {
        with: {
          fieldOptions: true,
        },
      },
    },
  });

  if (!form) {
    throwTRPCError("NOT_FOUND", "The requested form context configuration could not be located.");
  }
  return form;
};

export {
  createForm,
  updateForm,
  deleteForm,
  getAllForms,
  getSingleFormDetails,
  getAllPublicForms,
  getFormBySlug,
};
