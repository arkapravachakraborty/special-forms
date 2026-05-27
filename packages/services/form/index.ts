import { db, eq } from "@repo/database";
import {
    createFormInput,
    type CreateFormInputType,
    listFormsbyUserIdInput,
    type ListFormsbyUserIdInputType,
} from "./model";
import { formTable } from "@repo/database/models/form";
import { formFieldTable } from "@repo/database/models/form-field";

export default class FormService {
    public async createForm(payload: CreateFormInputType) {
        // get the value
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);
        // add it to DB
        const result = await db
            .insert(formTable)
            .values({
                title,
                description,
                createdBy,
            })
            .returning({
                id: formTable.id,
            })

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("Failed to create form");
        }

        return {
            id: result[0].id
        };
    }

    public async listFormsbyUserId(payload: ListFormsbyUserIdInputType) {
        // get the value
        const { userId } = await listFormsbyUserIdInput.parseAsync(payload);
        // add it to DB
        const forms = await db
            .select({
                id: formTable.id,
                title: formTable.title,
                description: formTable.description,
                createdAt: formTable.createdAt,
                updatedAt: formTable.updatedAt,
            })
            .from(formTable)
            .where(eq(formTable.createdBy, userId));

        return forms;
    }

    public async getFormWithFeilds(fromId: string) {
        // public form page => it will call this new service => form + form fields
        const rows = await db.select({
            id: formTable.id,
            title: formTable.title,
            description: formTable.description,
            createdAt: formTable.createdAt,
            updatedAt: formTable.updatedAt,

            field_id: formFieldTable.id,
            field_formId: formFieldTable.formId,
            field_label: formFieldTable.label,
            field_labelKey: formFieldTable.labelKey,
            field_description: formFieldTable.description,
            field_placeholder: formFieldTable.placeholder,
            field_isRequired: formFieldTable.isRequired,
            field_index: formFieldTable.index,
            field_type: formFieldTable.type,
            field_createdAt: formFieldTable.createdAt,
            field_updatedAt: formFieldTable.updatedAt,
        })
            .from(formTable)
            .leftJoin(formFieldTable, eq(formTable.id, formFieldTable.formId))
            .where(eq(formTable.id, fromId))
            .orderBy(formFieldTable.index);

        if (!rows || rows.length === 0) {
            throw new Error(`Form not found with id: ${fromId}`);
        }

        const first = rows[0]!;
        const form = {
            id: first.id,
            title: first.title,
            description: first.description ?? null,
            createdAt: first.createdAt ? first.createdAt.toISOString() : null,
            updatedAt: first.updatedAt ? first.updatedAt.toISOString() : null,
            fields: [] as Array<any>,
        };

        for (const r of rows) {
            if (!r.field_id) continue;

            form.fields.push({
                id: r.field_id,
                formId: r.field_formId,
                label: r.field_label,
                labelKey: r.field_labelKey,
                description: r.field_description,
                placeholder: r.field_placeholder,
                isRequired: r.field_isRequired,
                index: r.field_index,
                type: r.field_type,
                createdAt: r.field_createdAt ? r.field_createdAt.toISOString() : null,
                updatedAt: r.field_updatedAt ? r.field_updatedAt.toISOString() : null,
            });
        }
        return form;
    }

}

