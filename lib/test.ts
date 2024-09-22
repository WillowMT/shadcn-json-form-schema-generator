import { db } from "./db";
import { eq } from "drizzle-orm";
import { userTable } from "./schema";

// insert user test

const user = db.insert(userTable).values({
    id: 'test',
    username: 'test',
    password: 'test'
}).returning().then((user) => {
    console.log(user)
});

