'use server'

import { db } from "@/lib/db";
import { verifyPassword, hashPassword } from '@/lib/hash'
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { verifyCaptchaToken } from "@/lib/captcha";
import { userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";


export async function signup({
    username,
    password,
    email,
    captchaToken
}: {
    username: string,
    password: string,
    email: string,
    captchaToken?: string
}) {

    console.log('signup', username, password, email, captchaToken)

    // if (!captchaToken) {
    //     return {
    //         error: "Invalid captcha"
    //     };
    // }

    // const captchaResult = await verifyCaptchaToken(captchaToken);

    // if (!captchaResult) {
    //     return {
    //         error: "Invalid captcha"
    //     };
    // }


    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31
    ) {
        return {
            error: "Invalid username"
        };
    }

    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }

    const passwordHash = await hashPassword(password);

    // check if username is used
    const existingUser = await db.select().from(userTable).where(eq(userTable.username, username))

    if (existingUser.length > 0) {
        console.log('username is taken')

        return {
            error: "Username is taken"
        };
    }



    try {
        const user = await db.insert(userTable).values({
            id: nanoid(),
            username: username,
            password: passwordHash
        }).returning();

        const session = await lucia.createSession(user[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        console.log('user created!');

    } catch (error) {
        return {
            error: "Failed to create user"
        };
    }


}


export async function login({
    username,
    password,
    captchaToken
}: {
    username: string,
    password: string,
    captchaToken?: string
}) {

    // if (!captchaToken) {
    //     return {
    //         error: "Invalid captcha"
    //     };
    // }

    // const captchaResult = await verifyCaptchaToken(captchaToken);

    // if (!captchaResult) {
    //     return {
    //         error: "Invalid captcha"
    //     };
    // }

    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31
    ) {
        return {
            error: "Invalid username"
        };
    }

    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }


    const existingUser = await db.select().from(userTable).where(eq(userTable.username, username))


    if (existingUser.length === 0) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.
        return {
            error: "Incorrect username or password"
        };
    }

    const validPassword = await verifyPassword(password, existingUser[0].password);

    if (!validPassword) {
        return {
            error: "Incorrect username or password"
        };
    }


    const session = await lucia.createSession(existingUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}



export async function logout() {

    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return
}