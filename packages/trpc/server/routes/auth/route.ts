import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
    createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel,
    signInUserWithEmailAndPasswordInputModel,
    signInUserWithEmailAndPasswordOutputModel,
    getLoggedInUserInfoInputModel,
    getLoggedInUserInfoOutputModel,
} from "./model";
import { userService } from "../../services";

import { generatePath } from "../../utils/path-generator";

const getPath = generatePath("/authentication");
const TAGS = ["Authentication"];

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createUserWithEmailAndPassword"),
                tags: TAGS,
            }
        })
        .input(createUserWithEmailAndPasswordInputModel)
        .output(createUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { name, email, password } = input;
            const { id, token } = await userService.createUserWithEmailAndPassword({
                name,
                email,
                password,
            })
            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            return {
                id,
            }
        }),

    signInUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signInUserWithEmailAndPassword"),
                tags: TAGS,
            }
        })
        .input(signInUserWithEmailAndPasswordInputModel)
        .output(signInUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;
            const { id, token } = await userService.signInUserWithEmailAndPassword({
                email,
                password,
            })
            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            return {
                id,
            }
        }),

    getLoggedInUserInfo: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getLoggedInUserInfo"),
                tags: TAGS,
            }
        })
        .input(getLoggedInUserInfoInputModel)
        .output(getLoggedInUserInfoOutputModel)
        .query(async ({ ctx }) => {
            const { id, name, email } = await userService.getUserInfoById(ctx.user.id);
            return {
                id,
                name,
                email,
            }
        }),
})

