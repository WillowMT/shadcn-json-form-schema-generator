'use server'

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
            error: "Unauthorized"
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
            error: "Unauthorized"
        }
    }
    return updatePost(id, title, content, user.id)
}

export async function deletePostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "Unauthorized"
        }
    }
    return deletePost(id, user.id)
}

export async function likePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "Unauthorized"
        }
    }
    return likePost(userId, postId)
}

export async function publishPostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "Unauthorized"
        }
    }
    return publishPost(id, user.id)
}

export async function unpublishPostAction(id: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "Unauthorized"
        }
    }
    return unpublishPost(id, user.id)
}

export async function unlikePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    if (!user) {
        return {
            error: "Unauthorized"
        }
    }
    return unlikePost(userId, postId)
}