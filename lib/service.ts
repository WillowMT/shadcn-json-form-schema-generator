import 'server-only'

import { db } from './db'
import { postTable, userTable, sessionTable, likeTable } from './schema'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'


// user create post
export async function createPost(userId: string, title: string, content: string) {
    return db.insert(postTable).values({
        userId,
        title,
        content,
        createdAt: Date.now()
    }).returning({
        id: postTable.id,
        title: postTable.title,
        content: postTable.content,
        createdAt: postTable.createdAt
    })
}

// user get post
export async function getPost(id: string) {
    return db.select().from(postTable).where(eq(postTable.id, id)).get()
}

// user update post
export async function updatePost(id: string, title: string, content: string) {
    return db.update(postTable).set({ title, content }).where(eq(postTable.id, id))
}

// user delete post
export async function deletePost(id: string) {
    return db.delete(postTable).where(eq(postTable.id, id))
}

// user publish post
export async function publishPost(id: string) {
    return db.update(postTable).set({ published: 1 }).where(eq(postTable.id, id))
}

// user unpublish post
export async function unpublishPost(id: string) {
    return db.update(postTable).set({ published: 0 }).where(eq(postTable.id, id))
}

// user like post
export async function likePost(userId: string, postId: string) {
    return db.insert(likeTable).values({ id: nanoid(), userId, postId }).returning()
}
