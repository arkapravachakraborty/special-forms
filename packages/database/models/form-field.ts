import {
    boolean,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";
import { placeholder } from "drizzle-orm";

export const fieldTypeEnum = pgEnum("field_type_enum", [
    "TEXT",
    "EMAIL",
    "PASSWORD",
    "YES_NO",
    "NUMBER",
]);

export const formFieldTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id").references(() => formTable.id),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),
    placeholder: text("placeholder"),

    isRequired: boolean("is_required").default(false),
    index: numeric("index"),

    type: fieldTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});