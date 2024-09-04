"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {FileIcon, StarIcon} from "lucide-react";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="w-40 flex flex-col gap-4">
            <Link href="/dashboard">
                <Button variant="link" className={clsx("flex gap-2", {
                    "text-blue-600": pathname === "/dashboard"
                })}>
                    <FileIcon/> All Files
                </Button>
            </Link>
            <Link href="/dashboard/favorites">
                <Button variant="link" className={clsx("flex gap-2", {
                    "text-blue-600": pathname === "/dashboard/favorites"
                })}>
                    <StarIcon/> Favorites
                </Button>
            </Link>
        </div>
    )
}

export default Sidebar;
