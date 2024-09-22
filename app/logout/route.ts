import { logout } from "@/lib/lucia-actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function GET(req: Request) {
    await logout()
    revalidatePath("/")
    redirect("/")
}