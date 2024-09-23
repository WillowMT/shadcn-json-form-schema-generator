import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from './theme-toggle';
import Link from 'next/link';
import { AuthAvatar } from './auth-avatar';

const Navbar = () => {
    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Registry', href: '/registry' },
        { name: 'My Posts', href: '/me' },
        // { name: 'Contact', href: '/contact' }
    ];

    return (
        <nav className=" p-4">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className=" font-bold text-xl">Logo</a>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <Button key={item.name} variant="ghost" className="" asChild>
                            <a href={item.href}>{item.name}</a>
                        </Button>
                    ))}
                    <AuthAvatar />
                    <ModeToggle />
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col space-y-4 mt-4">
                            {navItems.map((item) => (
                                <Button key={item.name} variant="ghost" asChild>
                                    <a href={item.href}>{item.name}</a>
                                </Button>
                            ))}
                            <Button asChild>
                                <Link href={"/login"}>
                                    Login
                                </Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
};

export default Navbar;