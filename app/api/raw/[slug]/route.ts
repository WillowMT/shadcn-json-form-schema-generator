import { getOnePost } from "@/lib/service"

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const { slug } = params
    const path = slug

    if (!path) {
        return new Response('Missing path', { status: 400 })
    }

    console.log('path', path)
    const file = await getOnePost(path)

    // return json
    return Response.json(JSON.parse(file?.content || "") || {})
}