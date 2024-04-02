"use client";

import { Input } from "@/components/ui/input";
import Form from "./_components/form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/use-conversation";
import Body from "./_components/body";
import { useCallback, useEffect, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";

interface FormProps {
    params: { otherUserName: string };
}

const ConversationPage = ({
    params,
}: FormProps) => {
    const [conversation, setConversation] = useState<Doc<"conversations"> | null>(null);

    const get = useMutation(api.conversations.getOrCreateConversation);
    const conv = useQuery(api.conversations.getConversation, { username: params.otherUserName });
    useEffect(() => {
        const callMutation = async () => {
            try {
                const result = await get({ otherUsername: params.otherUserName });
                setConversation(result);
            } catch (error) {
                console.error('Mutation failed:', error);
            }
        };

        callMutation();
    }, [get, params.otherUserName]);

    if (conversation === null || conv === undefined || conv === undefined) {
        return <div className="text-center text-muted-foreground text-3xl font-semibold p-4 animation-pulse">Loading...</div>
    }
    console.log(conversation);
    return (
        <div className="h-full">
            <div className="h-full flex flex-col">
                <Body messages={conv.messagesWithUsers} />
                <Form
                    userId={conversation.currentUser._id}
                    conversationId={conversation.conversation._id}
                />
            </div>
        </div>
    );
};
export default ConversationPage;