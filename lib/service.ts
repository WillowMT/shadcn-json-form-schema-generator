import 'server-only'

import { db } from './db'
import { postTable, userTable, sessionTable, likeTable } from './schema'
import { nanoid } from 'nanoid'
import { and, eq, desc } from 'drizzle-orm'


// user create post
export async function createPost(userId: string, title: string, content: string) {
    return db.insert(postTable).values({
        id: nanoid(),
        userId,
        title,
        content,
        createdAt: Date.now(),
        published: 1
    }).returning()
}

// user get post
export async function getOnePost(id: string) {
    return db.select().from(postTable).where(eq(postTable.id, id)).get()
}

// user get own post
export async function getOwnPost(userId: string) {
    return db.select({
        id: postTable.id,
        title: postTable.title,
        content: postTable.content,
        createdAt: postTable.createdAt,
        authorName: userTable.username
    }).from(postTable).where(eq(postTable.userId, userId)).leftJoin(userTable, eq(postTable.userId, userTable.id))
}

// get all published post order by createdAt desc
export async function getAllPublishedPost() {
    return db.select({
        id: postTable.id,
        title: postTable.title,
        content: postTable.content,
        createdAt: postTable.createdAt,
        authorName: userTable.username
    })
        .from(postTable)
        .leftJoin(userTable, eq(postTable.userId, userTable.id))
        .where(eq(postTable.published, 1))
        .orderBy(desc(postTable.createdAt))
}


// user update post
export async function updatePost(id: string, title: string, content: string, userId: string) {
    return db.update(postTable).set({ title, content }).where(and(eq(postTable.id, id), eq(postTable.userId, userId)))
}

// user delete post
export async function deletePost(id: string, userId: string) {
    return db.delete(postTable).where(and(eq(postTable.id, id), eq(postTable.userId, userId)))
}

// user publish post
export async function publishPost(id: string, userId: string) {
    return db.update(postTable).set({ published: 1 }).where(and(eq(postTable.id, id), eq(postTable.userId, userId)))
}

// user unpublish post
export async function unpublishPost(id: string, userId: string) {
    return db.update(postTable).set({ published: 0 }).where(and(eq(postTable.id, id), eq(postTable.userId, userId)))
}

// user like post
export async function likePost(userId: string, postId: string) {
    return db.insert(likeTable).values({ id: nanoid(), userId, postId }).returning()
}

// user unlike post
export async function unlikePost(userId: string, postId: string) {
    return db.delete(likeTable).where(and(eq(likeTable.userId, userId), eq(likeTable.postId, postId)))
}

// user get likes
export async function getLikes(postId: string) {
    return db.select().from(likeTable).where(eq(likeTable.postId, postId))
}