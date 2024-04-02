import { Button } from "@/components/ui/button";
import { Clipboard, Home, Save, Star } from "lucide-react";
import Link from "next/link";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import queryString from "query-string";


interface HeaderProps {
    category: string;
    subcategory: string;
    editUrl: string;
    ownerId: string;
}

export const Header = ({ category, subcategory, editUrl, ownerId }: HeaderProps) => {
    const currentUser = useQuery(api.users.getCurrentUser, {});
    const router = useRouter();

    const handleSubcategoryClick = () => {
        const url = queryString.stringifyUrl({
            url: "/",
            query: {
                filter: subcategory,
            },
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    };
    return (
        <div
            className="
            flex 
            w-full 
            h-fit 
            items-center 
            space-x-2
            sm:space-x-1
            md:space-x-3 
            text-sm 
            md:text-md
            "
        >
            <Link href="/">
                <Home className="w-4 h-4" />
            </Link>
            <p className="text-muted-foreground cursor-default">/</p>
            <p className="cursor-default">{category}</p>
            <p className="text-muted-foreground cursor-default">/</p>
            <div className="font-medium cursor-pointer" onClick={handleSubcategoryClick}>{subcategory}</div>
            {(currentUser?._id === ownerId &&
                <Button variant={"secondary"}>
                    <Link href={editUrl}>
                        Edit gig
                    </Link>
                </Button>
            )}
        </div>
    )
}