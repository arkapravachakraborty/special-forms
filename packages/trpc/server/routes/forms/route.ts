import { authenticatedProcedure, router } from "../../trpc";
import { createFormInputModel, createFormOutputModel } from "./model";
import { formService } from "../../services";

import { generatePath } from "../../utils/path-generator";

const getPath = generatePath("/forms");
const TAGS = ["Forms"];

export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
            }
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description } = input;
            const { id } = await formService.createForm({
                title,
                description,
                createdBy: ctx.user.id,
            })
            return {
                id,
            }
        }),
})
