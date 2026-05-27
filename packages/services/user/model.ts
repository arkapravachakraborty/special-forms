// import zod
import { z } from "zod";

// now for register with email and password what could a use can give
// a name, email, password

export const createUserWithEmailAndPassword = z.object({
    name: z.string().describe("Enter your full name"),
    email: z.email().describe("Enter your email"),
    password: z.string().min(8).describe("Enter your password"),
});

// now export the type also
export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPassword>

// JWT token has a payload, so we want that property also typed
export const generateUserTokenPayload = z.object({
    id: z.string().describe("ID of the user"),
})

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const signInUserWithEmailAndPassword = z.object({
    email: z.email().describe("Enter your email"),
    password: z.string().min(8).describe("Enter your password"),
})

export type SignInUserWithEmailAndPasswordType = z.infer<typeof signInUserWithEmailAndPassword>