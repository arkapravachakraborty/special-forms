import {
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";


export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 322 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    salt: varchar("salt", { length: 128 }).notNull(),

    createdAt: timestamp("created-at").defaultNow(),
    updatedAt: timestamp("updated-at").$onUpdate(() => new Date()),
})