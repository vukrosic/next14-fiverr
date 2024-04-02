"use client";
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Images } from "@/components/images"
import Link from "next/link";

interface MyGigsListProps {
    sellerUsername: string
}

export const MyGigsList = ({
    sellerUsername
}: MyGigsListProps) => {
    const gigs = useQuery(api.gigs.getGigsWithImages, { sellerUsername: sellerUsername });
    if (gigs === undefined) {
        return <div>Loading...</div>
    }

    return (
        <Carousel opts={{
            align: "start",
            loop: true,
            dragFree: false,

        }} className="w-full">
            <CarouselContent>
                {gigs.map((gig) => (
                    <CarouselItem className="basis-1/3" key={gig._id}>
                        <Link href={`/${sellerUsername}/${gig._id}`}>
                            <Images
                                images={gig.images}
                                title={gig.title}
                                allowDelete={false}
                            />
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
