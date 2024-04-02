"use client";

import { SignInButton, SignUpButton, UserButton, useClerk } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import * as React from "react"
import Link from "next/link"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loading } from "@/components/auth/loading";
import { useQuery } from "convex/react";
import { Filter, Heart, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import { ListItem } from "./list-item";
import { TooltipProvider } from "./tooltip-provider";
import { ListItem } from "./list-item";
import ConnectStripe from "./connect-stripe";


const Navbar = () => {
    const categories = useQuery(api.categories.get);
    const currentUser = useQuery(api.users.getCurrentUser);
    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites");
    const filter = searchParams.get("filter");

    const router = useRouter();

    if (categories === undefined) {
        return <Loading />;
    }

    const onClickInbox = () => {
        router.push("/inbox");
    }

    const clearFilters = () => {
        router.push("/");
    }

    return (
        <>
            <Separator />
            <div className="flex items-center gap-x-4 p-5 bg-white">
                <div className="hidden lg:flex lg:flex-1">
                    <SearchInput />
                </div>
                <Dialog>
                    <DialogTrigger>
                        <TooltipProvider
                            text="Filter"
                        >
                            <Filter className="mx-4 my-3" />
                        </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-auto max-h-[calc(100vh-200px)]">
                        {/* <ScrollArea className="rounded-md border"> */}
                        <DialogClose>
                            <>
                                <Button
                                    onClick={clearFilters}
                                    variant="ghost"
                                    className="text-red-500"
                                    disabled={!filter}
                                >
                                    Clear filters
                                </Button>
                                {categories.map((category, index) => (
                                    <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                                        <div className="space-y-2">
                                            {category.subcategories.map((subcategory, subIndex) => (
                                                <ListItem
                                                    key={subIndex}
                                                    title={subcategory.name}
                                                    subcategory={subcategory}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        </DialogClose>
                    </DialogContent>
                    {/* </ScrollArea> */}
                </Dialog>

                {currentUser && (
                    <>
                        <TooltipProvider text="Favorites">
                            <Button
                                asChild
                                variant={favorites ? "secondary" : "ghost"}
                                size="lg"
                                className="p-4"
                            >
                                <Link
                                    href={{
                                        pathname: "/",
                                        query: favorites ? {} : { favorites: true }
                                    }}
                                    className="p-0"
                                >
                                    <Heart className={favorites ? "fill-black" : ""} />
                                </Link>
                            </Button>
                        </TooltipProvider>

                        <TooltipProvider text="Inbox" >
                            <Button onClick={onClickInbox} variant={"ghost"}>
                                <MessageCircle />
                            </Button>
                        </TooltipProvider>

                        <Button onClick={() => router.push(`/seller/${currentUser.username}/manage-gigs`)}>
                            Switch To Selling
                        </Button>
                        {!currentUser.stripeAccountSetupComplete &&
                            <ConnectStripe />
                        }
                        <UserButton />
                    </>
                )}
                {!currentUser && (
                    <>
                        <Button variant="default" asChild>
                            <SignUpButton mode="modal" />
                        </Button>
                        <Button variant="ghost" asChild>
                            <SignInButton mode="modal" />
                        </Button>

                    </>
                )}
            </div >
            <Separator />
        </>
    );
}

export default Navbar;