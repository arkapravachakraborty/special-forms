import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    name: z.string().describe("Enter your name"),
    email: z.email().describe("Enter your Email"),
    password: z.string().min(8).describe("Enter your password"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("USER Id")
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("Enter your Email"),
    password: z.string().min(8).describe("Enter your password"),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("USER Id")
});


export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe("USER Id"),
    name: z.string().describe("User Name"),
    email: z.email().describe("User Email"),
})