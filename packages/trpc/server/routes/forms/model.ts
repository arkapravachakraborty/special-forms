import { z } from "zod";

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
    id: z.string().describe("Id of the form"),
});

export const listFormsbyUserIdInputModel = z.undefined();

export const listFormsbyUserIdOutputModel = z.array(
    z.object({
        id: z.string().describe("Id of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),

        createdAt: z.date().nullable().describe("Created at of the form"),
        updatedAt: z.date().nullable().describe("Updated at of the form"),
    })
)
