"use client";

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { GigCard } from "./gig-card";

export const GigList = () => {
    const gigs = useQuery(api.gigs.get, {});
    return (
        <>
            {gigs?.map((gig) => (
                <GigCard
                    key={gig._id}
                    gig={gig}
                />
            ))}
        </>
    )
}