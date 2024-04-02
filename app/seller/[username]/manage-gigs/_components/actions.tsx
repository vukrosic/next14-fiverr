import React from 'react';
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Id } from '@/convex/_generated/dataModel';

interface GigActionsCellProps {
    gigId: Id<"gigs">;
    username: string;
}

const GigActionsCell = ({ gigId, username }: GigActionsCellProps) => {
    const {
        mutate: remove,
        pending: removePending,
    } = useApiMutation(api.gig.remove);

    const handleDelete = () => {
        console.log("Delete", gigId)
        remove({ id: gigId });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Link href={`/seller/${username}/manage-gigs/edit/${gigId}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                >
                    <Link href={`/${username}/${gigId}`}>Preview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default GigActionsCell;