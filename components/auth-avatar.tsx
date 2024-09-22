import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { validateRequest } from "@/lib/lucia";
import { Button } from "./ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { logout } from "@/lib/lucia-actions";

export async function AuthAvatar() {
    const { user } = await validateRequest()

    if (!user) {
        return <Link href="/login">
            <Button>Login</Button>
        </Link>
    }

    return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarFallback className="bg-secondary p-2 rounded-full">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" w-40">
                    <DropdownMenuItem>
                        
                        {/* <form action={logout} className="w-full">
                            <Button type="submit" className="w-full" variant={"ghost"}>Logout</Button>
                        </form> */}
                        <Link href="/logout">Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}
