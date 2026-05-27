import { z } from "zod";

export const createFormInput = z.object({
    title: z.string().max(50).describe("enter your form title").default("Untitled Form"),
    description: z.string().max(200).optional().describe("enter your form description"),
    createdBy: z.string().uuid().describe("enter your user id"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
