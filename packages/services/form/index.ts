import db from "@repo/database";
import {
    createFormInput,
    type CreateFormInputType,
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
}
