"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TitleEditorProps {
    id: Id<"gigs">;
    title: string;
}

export const TitleEditor = ({
    id,
    title
}: TitleEditorProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(title);

    const update = useMutation(api.gig.update);

    const enableInput = () => {
        setIsEditing(true);
        setTimeout(() => {
            setValue(title);
            const inputElement = inputRef.current;
            inputRef.current?.focus();
            inputElement?.setSelectionRange(inputElement.value.length, inputElement.value.length);
        }, 0);
    };

    const disableEditing = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: id,
            title: value || "Untitled"
        });
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableEditing();
        }
    };

    return (
        <div>
            {isEditing ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableEditing}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="w-full text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F]"
                    maxLength={60}
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]"
                >
                    {title}
                </div>
            )}
        </div>
    )
}