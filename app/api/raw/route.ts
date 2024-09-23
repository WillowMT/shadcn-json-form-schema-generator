import { getOnePost } from "@/lib/service"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')

    if (!path) {
        return new Response('Missing path', { status: 400 })
    }

    console.log('path', path)
    const file = await getOnePost(path)

    // return json
    return Response.json(JSON.parse(file?.content || "") || {})
}