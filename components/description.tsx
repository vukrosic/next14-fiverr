"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

import { useMutation } from "convex/react";
import { AlertOctagon } from "lucide-react";
import { toast } from "sonner";

interface DescriptionProps {
    gigId: Id<"gigs">;
    initialContent?: string;
    editable: boolean;
    className?: string;
}

export const Description = ({
    gigId,
    initialContent,
    editable,
    className
}: DescriptionProps) => {
    const update = useMutation(api.gig.updateDescription);

    const editor = useCreateBlockNote({
        initialContent:
            initialContent
                ? JSON.parse(initialContent)
                : undefined,
    });

    const handleChange = () => {
        if (editor.document) {
            const contentLength = JSON.stringify(editor.document).length;
            if (contentLength < 20000) {
                update({
                    id: gigId,
                    description: JSON.stringify(editor.document, null, 2)
                });
            } else {
                toast.error('Content is too long. Not saved.', {
                    duration: 2000,
                    icon: <AlertOctagon />,
                });
            }
        }
    };

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            theme="light"
            onChange={handleChange}
            className={className}
        />
    );
}