import { authenticatedProcedure, router } from "../../trpc";
import {
    createFormInputModel,
    createFormOutputModel,
    listFormsbyUserIdInputModel,
    listFormsbyUserIdOutputModel
} from "./model";
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

    listFormsbyUserId: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listFormsbyUserId"),
                tags: TAGS,
            }
        })
        .input(listFormsbyUserIdInputModel)
        .output(listFormsbyUserIdOutputModel)
        .query(async ({ ctx }) => {
            const forms = await formService.listFormsbyUserId({ userId: ctx.user.id });

            return forms;
        })
})
