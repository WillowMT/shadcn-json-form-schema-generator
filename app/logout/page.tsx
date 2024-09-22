import { logout } from "@/lib/lucia-actions"
import { redirect } from "next/navigation"

export default async function Logout() {
    await logout()
    redirect("/login")
}