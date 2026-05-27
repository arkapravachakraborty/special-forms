import type { CookieOptions } from "express";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import {
    setCookie as setCookieUtils,
    getCookie as getCookieUtils,
    clearCookie as clearCookieUtils
} from "./utils/cookie";

export interface TRPCCtxUser {
    id: string;
}

export interface TRPCContext {
    user?: TRPCCtxUser;
    setCookie: (name: string, val: string, opts: CookieOptions) => void;
    getCookie: (name: string) => string | undefined;
    clearCookie: (name: string) => void;
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
    const ctx: TRPCContext = {
        setCookie(name: string, val: string, opts: CookieOptions) {
            return setCookieUtils(res, name, val, opts);
        },
        getCookie(name: string) {
            return getCookieUtils(req, name);
        },
        clearCookie(name: string) {
            return clearCookieUtils(res, name);
        },
        user: undefined,
    }
    return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
