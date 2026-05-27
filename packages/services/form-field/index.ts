import { formFieldsTable } from "@repo/database/models/form-field";
import {
  createFormFieldBatchInput,
  CreateFormFieldBatchInputType,
  UpdateBatchFormFieldInputType,
  updateBatchFormFieldItemInput,
  updateBatchFormFieldsInput,
} from "./model";
import db, { and, eq, notInArray } from "@repo/database";
import { throwTRPCError } from "../../trpc/server/utils/trpc-error";
import { fieldOptionsTable } from "@repo/database/models/field-options";

const createFormFieldBatch = async (payload: CreateFormFieldBatchInputType) => {
  const batchData = await createFormFieldBatchInput.parseAsync(payload);

  return await db.transaction(async (tx) => {
    const results = [];

    for (const fieldData of batchData) {
      const insertedFields = await tx
        .insert(formFieldsTable)
        .values({
          formId: fieldData.formId,
          label: fieldData.label,
          type: fieldData.type,
          order: fieldData.order,
          required: fieldData.required,
          helperText: fieldData.helperText,
          placeholder: fieldData.placeholder,
          minLength: fieldData.minLength,
          maxLength: fieldData.maxLength,
          minValue: fieldData.minValue,
          maxValue: fieldData.maxValue,
        })
        .returning();

      const field = insertedFields[0];

      if (!field) {
        throwTRPCError("INTERNAL_SERVER_ERROR", `Field creation failed for: ${fieldData.label}`);
      }

      const optionsFieldTypes = ["select", "radio", "checkbox"];
      let insertedOptionsResult: any[] = [];

      if (optionsFieldTypes.includes(fieldData.type) && fieldData.options?.length) {
        const optionsToInsert = fieldData.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
          order: opt.order,
          fieldId: field.id,
        }));

        const insertedOptions = await tx
          .insert(fieldOptionsTable)
          .values(optionsToInsert)
          .returning();

        if (!insertedOptions.length) {
          throwTRPCError(
            "INTERNAL_SERVER_ERROR",
            `Failed to store field options for: ${fieldData.label}`,
          );
        }

        insertedOptionsResult = insertedOptions;
      }

      results.push({
        ...field,
        options: insertedOptionsResult,
      });
    }

    return results;
  });
};

const updateFormFieldsBatch = async (payload: UpdateBatchFormFieldInputType) => {
  const incomingFields = await updateBatchFormFieldsInput.parseAsync(payload);

  if (!incomingFields.length) return [];

  const formId = incomingFields[0]?.formId ?? "defaultId";

  const optionFieldTypes = ["select", "radio", "checkbox"];

  return await db.transaction(async (tx) => {
    // handle deletions first to clear out removed fields and cascade options

    const incomingDbIds: string[] = incomingFields
      .map((f) => f.id)
      .filter((id): id is string => !!id && !id.startsWith("field-"));

    if (incomingDbIds.length > 0) {
      await tx
        .delete(formFieldsTable)
        .where(
          and(eq(formFieldsTable.formId, formId), notInArray(formFieldsTable.id, incomingDbIds)),
        );
    } else {
      // If the canvas was emptied, wipe all records tied to this form
      await tx.delete(formFieldsTable).where(eq(formFieldsTable.formId, formId));
    }

    const processedFields = [];

    // 2. Process Creates and Updates
    for (const fieldData of incomingFields) {
      const isNewField = !fieldData.id || fieldData.id.startsWith("field-");
      let finalFieldRecord;

      const fieldValues = {
        formId: fieldData.formId,
        label: fieldData.label,
        type: fieldData.type,
        required: fieldData.required ?? false,
        order: fieldData.order,
        placeholder: fieldData.placeholder ?? null,
        helperText: fieldData.helperText ?? null,
        minLength: fieldData.minLength ?? null,
        maxLength: fieldData.maxLength ?? null,
        minValue: fieldData.minValue ?? null,
        maxValue: fieldData.maxValue ?? null,
      };

      if (isNewField) {
        const [inserted] = await tx.insert(formFieldsTable).values(fieldValues).returning();
        finalFieldRecord = inserted;
      } else {
        // Inside your API/TRPC handler
        const fieldId = fieldData.id;

        if (!fieldId) {
          throwTRPCError("BAD_REQUEST", "Field id is required");
        }

      
        const targetId = fieldId;

        const [updated] = await tx
          .update(formFieldsTable)
          .set(fieldValues)
          .where(eq(formFieldsTable.id, targetId))
          .returning();

        finalFieldRecord = updated;
      }

      if (!finalFieldRecord) {
        throwTRPCError("INTERNAL_SERVER_ERROR", `Failed to save field: ${fieldData.label}`);
      }

      // 3. Synchronize Child Options (Wipe and replace old options)
      await tx.delete(fieldOptionsTable).where(eq(fieldOptionsTable.fieldId, finalFieldRecord.id));

      let synchronizedOptions: (typeof fieldOptionsTable.$inferSelect)[] = [];
      if (optionFieldTypes.includes(finalFieldRecord.type) && fieldData.options?.length) {
        synchronizedOptions = await tx
          .insert(fieldOptionsTable)
          .values(
            fieldData.options.map((opt, index) => ({
              fieldId: finalFieldRecord!.id,
              label: opt.label,
              value: opt.value,
              order: opt.order ?? index,
            })),
          )
          .returning();
      }

      processedFields.push({
        ...finalFieldRecord,
        options: synchronizedOptions,
      });
    }

    return processedFields.sort((a, b) => a.order - b.order);
  });
};

const deleteFormField = async (formFieldId: string) => {
  const result = await db
    .delete(formFieldsTable)
    .where(eq(formFieldsTable.id, formFieldId))
    .returning();

  const deletedFormField = result[0];

  if (!deletedFormField) {
    throwTRPCError("NOT_FOUND", "Form field not found");
  }

  return deletedFormField;
};

export { createFormFieldBatch, updateFormFieldsBatch, deleteFormField };
