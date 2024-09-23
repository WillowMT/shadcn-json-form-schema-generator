'use server'

import { UnauthorizedError } from "./error";
import { validateRequest } from "./lucia";
import { createPost, getOnePost, updatePost, deletePost, likePost, publishPost, unpublishPost, unlikePost } from "./service";


async function checkAuth() {
    const result = await validateRequest()
    if (!result.user) {
        throw new UnauthorizedError("Unauthorized")
    }
    return result.user
}

export async function createPostAction(formData: FormData) {
    const user = await checkAuth()
    if (!formData.get('title') || !formData.get('content')) {
        throw new Error('Missing title or content')
    }

    const content = formData.get('content') as string
    const contentJson = JSON.parse(content)

    const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (xssPattern.test(content)) {
        throw new Error('Content contains potential XSS injection');
    }
    
    return createPost(user.id, formData.get('title') as string, contentJson)
}

export async function getOnePostAction(id: string) {
    return getOnePost(id)
}

export async function updatePostAction(id: string, title: string, content: string) {
    const user = await checkAuth()
    return updatePost(id, title, content, user.id)
}

export async function deletePostAction(id: string) {
    const user = await checkAuth()
    return deletePost(id, user.id)
}

export async function likePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    return likePost(userId, postId)
}

export async function publishPostAction(id: string) {
    const user = await checkAuth()
    return publishPost(id, user.id)
}

export async function unpublishPostAction(id: string) {
    const user = await checkAuth()
    return unpublishPost(id, user.id)
}

export async function unlikePostAction(userId: string, postId: string) {
    const user = await checkAuth()
    return unlikePost(userId, postId)
}