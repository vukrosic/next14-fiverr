"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Description } from "@/components/description";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images } from "@/components/images";
import { TitleEditor } from "@/components/title-editor";

import { Label } from "@/components/ui/label";
import { OffersEditor } from "./_components/offers-editor";



interface EditdPageProps {
    params: {
        gigId: string;
    };
};

const Edit = ({ params }: EditdPageProps) => {
    const gig = useQuery(api.gig.get, { id: params.gigId as Id<"gigs"> })
    const published = useQuery(api.gig.isPublished, { id: params.gigId as Id<"gigs"> });
    const {
        mutate: remove,
        pending: removePending,
    } = useApiMutation(api.gig.remove);
    const {
        mutate: publish,
        pending: publishPending,
    } = useApiMutation(api.gig.publish);
    const {
        mutate: unpublish,
        pending: unpublishPending,
    } = useApiMutation(api.gig.unpublish);
    const router = useRouter();

    const identity = useAuth();

    const generateUploadUrl = useMutation(api.gigMedia.generateUploadUrl);

    const imageInput = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const sendImage = useMutation(api.gigMedia.sendImage);


    if (!identity) {
        throw new Error("Unauthorized");
    }

    // Undefined means it's still retrieving
    if (gig === undefined || published === undefined) {
        return null;
    }

    if (gig === null) {
        return <div>Not found</div>;
    }

    async function handleSendImage(event: FormEvent) {
        event.preventDefault();
        if (gig === undefined) return;

        const nonNullableGig = gig as Doc<"gigs">;

        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        await Promise.all(selectedImages.map(async (image) => {
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": image.type },
                body: image,
            });

            const json = await result.json();

            if (!result.ok) {
                throw new Error(`Upload failed: ${JSON.stringify(json)}`);
            }
            const { storageId } = json;
            // Step 3: Save the newly allocated storage id to the database
            await sendImage({ storageId, format: "image", gigId: nonNullableGig._id })
                .catch((error) => {
                    console.log(error);
                    toast.error("Maximum 5 files reached.");
                });
        }));

        setSelectedImages([]);
        imageInput.current!.value = "";
    }

    const onPublish = async () => {
        console.log(published)
        if (!published) {
            publish({ id: params.gigId as Id<"gigs"> })
                .catch((error) => {
                    console.log(error);
                    toast.error("Failed to publish. Please make sure there are at least 1 image, 3 offers and a description.");
                });
        }
        else {
            unpublish({ id: params.gigId as Id<"gigs"> })
        }
    }

    const onDelete = async () => {
        remove({ id: params.gigId as Id<"gigs"> });
        router.back();
    };


    return (
        <>
            <div className="space-y-12 2xl:px-64 xl:px-36 md:px-12 px-12">
                <div className="flex justify-end pr-2 space-x-2">
                    <Button disabled={publishPending || unpublishPending} variant={"default"} onClick={onPublish}>
                        {published ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/${gig.seller.username}/${gig._id}`}>
                        <Button disabled={removePending} variant={"secondary"}>
                            Preview
                        </Button>
                    </Link>
                    <Button disabled={removePending} variant={"secondary"} onClick={onDelete}>
                        Delete
                    </Button>
                </div>

                <TitleEditor
                    id={gig._id}
                    title={gig.title}
                />
                <div className="w-[800px]">
                    <Images
                        images={gig.images}
                        title={gig.title}
                        allowDelete={true}

                    />
                </div>
                <form onSubmit={handleSendImage} className="space-y-2">
                    <Label className="font-normal">Add up to 5 images:</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            ref={imageInput}
                            onChange={(event) => setSelectedImages(Array.from(event.target.files || []))}
                            multiple
                            className="cursor-pointer w-fit bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200 hover:border-zinc-400 focus:border-zinc-400 focus:bg-zinc-200"
                            disabled={selectedImages.length !== 0}
                        />
                        <Button
                            type="submit"
                            disabled={selectedImages.length === 0}
                            className="w-fit"
                        >Upload Image</Button>
                    </div>
                </form>
                <div className="flex rounded-md border border-zinc-300 items-center space-x-4 w-fit p-2 cursor-default">
                    <p className="text-muted-foreground">👨‍🎨 Creator: {"Vuk Rosic"}</p>
                </div>

                <OffersEditor
                    gigId={gig._id}
                />

                <h2 className="font-semibold">About this gig</h2>
            </div>


            <Description
                initialContent={gig.description}
                editable={true}
                className="pb-40 mt-12 2xl:px-[200px] xl:px-[90px] xs:px-[17px]"
                gigId={gig._id}
            />

        </>
    )
}

export default Edit;