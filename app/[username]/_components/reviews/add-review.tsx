"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


interface AddReviewProps {
    gigId: Id<"gigs">;
    sellerId: Id<"users">;
}


const formSchema = z.object({
    comment: z.string().min(5, {
        message: "Comment must be at least 5 characters.",
    }),
    service_as_described: z.number().min(1, {
        message: "Service as described must be at least 1.",
    }).max(5, {
        message: "Service as described must be at most 5.",
    }),
    recommend_to_a_friend: z.number().min(1, {
        message: "Recommend to a friend must be at least 1.",
    }).max(5, {
        message: "Recommend to a friend must be at most 5.",
    }),
    communication_level: z.number().min(1, {
        message: "Communication level must be at least 1.",
    }).max(5, {
        message: "Communication level must be at most 5.",
    }),
});

export const AddReview = ({
    gigId,
    sellerId
}: AddReviewProps) => {
    const {
        mutate,
        pending
    } = useApiMutation(api.reviews.add);

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
            service_as_described: 5, // Set default value as numeric so it doesn't give weird 'expected number got string' error
            recommend_to_a_friend: 5,
            communication_level: 5,
        },
    })

    // Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        // You can now use these values for mutation.
        mutate({
            gigId: gigId,
            sellerId: sellerId,
            comment: values.comment,
            service_as_described: values.service_as_described, // Parse as integer
            recommend_to_a_friend: values.recommend_to_a_friend, // Parse as integer
            communication_level: values.communication_level, // Parse as integer
        })
            .then(() => {
                // Handle success
            })
            .catch((error) => {
                // Handle error
            });
        form.reset();
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-neutral-700">Add review</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Comment Field */}
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your comment" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Leave review comment.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Service as Described Field */}
                    <FormField
                        control={form.control}
                        name="service_as_described"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service As Described</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" placeholder="Rate from 1 to 5" {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Rate how accurately the service was described.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Recommend to a Friend Field */}
                    <FormField
                        control={form.control}
                        name="recommend_to_a_friend"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recommend to a Friend</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" placeholder="Rate from 1 to 5" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormDescription>
                                    Would you recommend our service to a friend?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Communication Level Field */}
                    <FormField
                        control={form.control}
                        name="communication_level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Communication Level</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" placeholder="Rate from 1 to 5" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormDescription>
                                    Rate the level of communication received.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
};
