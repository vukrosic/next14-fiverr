'use client';

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useState } from "react";
import {
    HiPaperAirplane,
    HiPhoto
} from "react-icons/hi2";

interface FormProps {
    userId: Doc<"users">["_id"];
    conversationId: Doc<"conversations">["_id"];
}

const Form = ({
    userId,
    conversationId,
}: FormProps) => {
    const [text, setText] = useState<string>("");
    const {
        mutate,
        pending
    } = useApiMutation(api.messages.send);

    const handleSubmit = () => {
        if (text === "") return;
        mutate({
            text: text,
            userId,
            seen: false,
            conversationId,
        })
            .then(() => {
                setText("");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div
            className="
            fixed
            bottom-0
            p-4
            bg-zinc-100 
            border-2
            flex 
            items-center 
            gap-2 
            lg:gap-4 
            w-full
        "
        >
            <div
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <div className="relative w-full">
                    <input
                        placeholder={"Enter message..."}
                        className="
                            text-black
                            font-light
                            py-2
                            px-4
                            bg-zinc-50
                            w-full 
                            rounded-full
                            focus:outline-none
                        "
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="
                        rounded-full 
                        p-2 
                        bg-sky-500 
                        cursor-pointer 
                        hover:bg-sky-600 
                        transition
                    "
                    onClick={handleSubmit}
                    disabled={pending}
                >
                    <HiPaperAirplane
                        size={18}
                        className="text-white"
                    />
                </button>
            </div>
        </div>
    );
}

export default Form;