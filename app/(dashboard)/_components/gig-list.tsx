"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { GigCard } from "./gig-card";
import { Loading } from "@/components/auth/loading";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { FullGigType } from "@/types";
import { useEffect, useState } from "react";

interface GigListProps {
    query: {
        search?: string;
        favorites?: string;
        filter?: string;
    };
};

export const GigList = ({
    query,
}: GigListProps) => {
    const gigs: FullGigType[] | undefined = useQuery(api.gigs.get, { search: query.search, favorites: query.favorites, filter: query.filter });
    const [gigsWithFavorite, setGigsWithFavorite] = useState<FullGigType[] | undefined>(undefined);
    // filter for favorites if query.favorites is true
    useEffect(() => {
        if (query.favorites) {
            const favoriteGigs = gigs?.filter((gig) => gig.favorited);
            setGigsWithFavorite(favoriteGigs);
        } else {
            setGigsWithFavorite(gigs);
        }
    }, [query.favorites, gigs]);

    if (gigs === undefined) {
        return (
            <>Loading gigs...</>
        )
    }

    if (!gigs?.length && query.search) {
        return (
            <EmptySearch />
        )
    }

    if (!gigsWithFavorite?.length && query.favorites) {
        return (
            <EmptyFavorites />
        )
    }


    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8 pb-10 mx-10">
                {gigsWithFavorite?.map((gig) => (
                    <GigCard
                        key={gig._id}
                        id={gig._id}
                        sellerId={gig.sellerId}
                        title={gig.title}
                        description={gig.description}
                        createdAt={gig._creationTime}
                        isFavorite={gig.favorited}
                        storageId={gig.storageId}
                        offer={gig.offer}
                        reviews={gig.reviews}
                    />
                ))
                }
            </div>
        </div>
    )
}