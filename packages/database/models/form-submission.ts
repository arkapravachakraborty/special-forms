import {
    json,
    pgTable,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";
import { formFieldTable } from "./form-field";

export interface FormSubmissionValue {
    fieldId: string;
    value: string;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export const formSubmissionsTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").references(() => formTable.id),
    formFieldId: uuid("form_field_id").references(() => formFieldTable.id),

    values: json("values").$type<FormSubmissionValueRow>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});