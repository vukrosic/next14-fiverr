import { useEffect, useRef, useState } from "react";
import MessageBox from "./message-box";
import { MessageWithUserType } from "@/types";

interface BodyProps {
    messages: MessageWithUserType[];
}

const Body = ({
    messages
}: BodyProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message._id}
                    message={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
}

export default Body;
