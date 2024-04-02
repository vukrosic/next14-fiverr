'use client';

import { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
    conversation: Doc<"conversations">;
    currentUser: Doc<"users">;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    conversation,
    currentUser,
}) => {
    const router = useRouter();
    const otherUserId = conversation.participantOneId === currentUser._id ? conversation.participantTwoId : conversation.participantOneId;
    const otherUser = useQuery(api.users.get, { id: otherUserId });
    const params = useParams();
    const otherUserCheck = useQuery(api.users.getUserByUsername, { username: params.otherUserName as string })

    const handleClick = useCallback(() => {
        router.push(`/inbox/${otherUser?.username}`);
    }, [router, otherUser?.username]);

    return (
        <div
            onClick={handleClick}
            className={cn(`
                w-full 
                relative 
                flex 
                items-center 
                space-x-6 
                p-3 
                hover:bg-neutral-100/10
                rounded-lg
                transition
                cursor-pointer
            `, otherUserCheck && otherUserCheck._id === otherUser?._id && 'bg-neutral-100/20')}
        >
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-md text-white font-medium">{otherUser?.fullName}</p>
        </div>
    )
}

export default ConversationBox;