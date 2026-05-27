import { db, eq } from "@repo/database";
import {
    createFormInput,
    type CreateFormInputType,
    listFormsbyUserIdInput,
    type ListFormsbyUserIdInputType,
} from "./model";
import { formTable } from "@repo/database/models/form";

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
}
