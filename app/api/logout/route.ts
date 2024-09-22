import { logout } from "@/lib/lucia-actions"

export async function GET() {
    await logout()
    return new Response(null, { status: 200 })
}