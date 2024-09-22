import { validateRequest } from "@/lib/lucia";

export async function GET(req: Request, res: Response) {
    const { user } = await validateRequest()
    return new Response(JSON.stringify(user), { status: 200 })
}