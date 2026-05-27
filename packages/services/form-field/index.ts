import { db, eq, max, sql } from "@repo/database";
import { formFieldTable } from "@repo/database/models/form-field"
import { createFieldInput, CreateFieldInputType } from "./model";
function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^$/g, "");
}
export default class FormFieldService {
    private async getNextIndex(formId: string) {
        const result = await db
            .select({ maxIndex: max(formFieldTable.index) })
            .from(formFieldTable)
            .where(eq(formFieldTable.formId, formId));

        const current = result[0]?.maxIndex;

        const next = current ? Number(current) + 1 : 0;

        return next.toString();
    }

    public async createField(payload: CreateFieldInputType) {
        const { label, type, formId, description, placeholder, isRequired } = await createFieldInput.parseAsync(payload);


        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);
        const result = await db
            .insert(formFieldTable)
            .values({
                label,
                labelKey,
                type,
                formId,
                description,
                placeholder,
                isRequired,
                index,
            })
            .returning({ id: formFieldTable.id })

        if (!result || result.length == 0 || !result[0]?.id) {
            throw new Error("Failed to create form field")
        }
        return {
            id: result[0].id,
            labelKey,
            index,
        }
    }

    public async getFeild(formId: string) {
        const result = await db
            .select()
            .from(formFieldTable)
            .where(eq(formFieldTable.formId, formId))
            .orderBy(formFieldTable.index);

        return result.map((r) => ({
            id: r.id,
            formId: r.formId,
            label: r.label,
            labelKey: r.labelKey,
            description: r.description ?? null,
            placeholder: r.placeholder ?? null,
            isRequired: r.isRequired ?? false,
            index: r.index?.toString() ?? "0",
            type: r.type,
            createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        }))
    }

}