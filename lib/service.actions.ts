'use server'

import { revalidatePath } from "next/cache";
import { UnauthorizedError } from "./error";
import { validateRequest } from "./lucia";
import { createPost, getOnePost, updatePost, deletePost, likePost, publishPost, unpublishPost, unlikePost } from "./service";


async function checkAuth() {
    const result = await validateRequest()
    if (!result.user) {
        return null
    }
    return result.user || null
}

export async function createPostAction(formData: FormData) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    if (!formData.get('title') || !formData.get('content')) {
        return {
            error: "Missing title or content"
        }
    }

    const content = formData.get('content') as string

    const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (xssPattern.test(content)) {
        return {
            error: "Content contains potential XSS injection"
        }
    }

    return createPost(user.id, formData.get('title') as string, content)
}

export async function getOnePostAction(id: string) {
    return getOnePost(id)
}

export async function updatePostAction(id: string, title: string, content: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    return updatePost(id, title, content, user.id)
}

export async function deletePostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    await deletePost(id, user.id)
    revalidatePath('/me','page')
    return true
}

export async function likePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    return likePost(userId, postId)
}

export async function publishPostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    return publishPost(id, user.id)
}

export async function unpublishPostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    return unpublishPost(id, user.id)
}

export async function unlikePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "User needs to be logged in."
        }
    }
    return unlikePost(userId, postId)
}