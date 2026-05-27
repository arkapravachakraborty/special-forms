import { Request, Response, CookieOptions } from "express";

export function setCookie(res: Response, name: string, val: string, opt: CookieOptions) {
    res.cookie(name, val, opt);
}

export function getCookie(req: Request, name: string): string | undefined {
    return req.cookies[name];
}

export function clearCookie(res: Response, name: string) {
    res.clearCookie(name);
}
