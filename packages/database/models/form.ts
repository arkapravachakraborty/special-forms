import {
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const formTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 55 }).notNull(),
    description: varchar("description", { length: 255 }),
    createdBy: uuid("created_by").references(() => userTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});