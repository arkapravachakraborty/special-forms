import crypto from "crypto";
import db, { eq } from "@repo/database";
import {
    createUserWithEmailAndPassword,
    type CreateUserWithEmailAndPasswordType,
    generateUserTokenPayload,
    type GenerateUserTokenPayloadType,
    signInUserWithEmailAndPassword,
    type SignInUserWithEmailAndPasswordType,

} from "./model";
import { userTable } from "@repo/database/models/user";
import * as JWT from "jsonwebtoken";
import { env } from "../env";

export default class UserService {
    private async getUserByEmail(email: string) {
        const result = await db.select().from(userTable).where(eq(userTable.email, email));
        // check if element present in array or not
        if (!result || result.length === 0 || !result[0]) {
            return null;
        }
        return result[0];
    }

    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload);

        const token = JWT.sign({ id }, env.JWT_SECRET);
        return { token };
    }
    public async createUserWithEmailAndPassword(paylod: CreateUserWithEmailAndPasswordType) {
        // data receive and validate
        const { name, email, password } = await createUserWithEmailAndPassword.parseAsync(paylod);
        // check in db if this email already exist
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
            throw new Error("User with this Email already exists");
        }
        // hash the password using Hmac
        const salt = crypto.randomBytes(64).toString("hex");
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
        // create a new user in db
        const newUser = await db.insert(userTable).values({
            name,
            email,
            password: hashedPassword,
            salt,
        }).returning({ id: userTable.id });
        // check new user created or not
        if (!newUser || newUser.length === 0 || !newUser[0]?.id) {
            throw new Error("Something went wrong while creating the user");
        }
        // create jwt token and set it to cookie
        const { token } = await this.generateUserToken({ id: newUser[0].id });

        // return the data
        return {
            id: newUser[0].id,
            token
        }
    }

    public async signInUserWithEmailAndPassword(paylod: SignInUserWithEmailAndPasswordType) {
        // data recive and validate
        const { email, password } = await signInUserWithEmailAndPassword.parseAsync(paylod);
        // check the user present in the db or not
        const existingUser = await this.getUserByEmail(email);
        if (!existingUser) {
            throw new Error("User with this Email does not exist");
        }
        // if use is there but not the password
        if (!existingUser.password) {
            throw new Error("Invalid authentication method, login with other method");
        }
        // hash the password and compare with the db password
        const hashedPassword = crypto.pbkdf2Sync(password, existingUser.salt, 100000, 64, "sha256").toString("hex");
        // if no password match then throw error
        if (hashedPassword !== existingUser.password) {
            throw new Error("Invalid Password");
        }
        // otherwise login the user and generate token
        const { token } = await this.generateUserToken({ id: existingUser.id });
        return {
            id: existingUser.id,
            token
        }
    }

}