"use client";

import { useQuery } from "convex/react"
import { Header } from "./_components/header"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Offers } from "./_components/offers";
import { Seller } from "./_components/seller";
import { Images } from "../../../components/images";
import { Description } from "@/components/description";
import { Info } from "lucide-react";
import { SellerDetails } from "./_components/seller-details";
import { Reviews } from "../_components/reviews/reviews";
import { AddReview } from "../_components/reviews/add-review";


interface PageProps {
    params: {
        username: string
        gigId: string
    }
}

const GigPage = ({
    params
}: PageProps) => {
    const gig = useQuery(api.gig.get, { id: params.gigId as Id<"gigs"> });
    //const seller = useQuery(api.users.getUserByUsername, { username: params.username });
    const categoryAndSubcategory = useQuery(api.gig.getCategoryAndSubcategory, { gigId: params.gigId as Id<"gigs"> });
    const offers = useQuery(api.offers.get, { gigId: params.gigId as Id<"gigs"> });
    const reviews = useQuery(api.reviews.getByGig, { gigId: params.gigId as Id<"gigs"> });
    const reviewsFull = useQuery(api.reviews.getFullByGig, { gigId: params.gigId as Id<"gigs"> });

    if (gig === undefined || reviews === undefined || reviewsFull === undefined || categoryAndSubcategory === undefined || offers == undefined) {
        return <div>Loading...</div>
    }

    if (gig === null || categoryAndSubcategory === null || offers === null) {
        return <div>Not found</div>
    }

    if (gig.published === false) {
        return <div>This gig is not published</div>
    }

    const editUrl = `/seller/${gig.seller.username}/manage-gigs/edit/${gig._id}`

    return (
        <div>
            <div className="flex flex-col sm:flex-row w-full sm:justify-center space-x-0 sm:space-x-3 lg:space-x-16">
                <div className="w-full space-y-8">
                    <Header
                        {...categoryAndSubcategory}
                        editUrl={editUrl}
                        ownerId={gig.seller._id}
                    />
                    <h1 className="text-3xl font-bold break-words text-[#3F3F3F]">{gig.title}</h1>
                    <Seller
                        seller={gig.seller}
                        reviews={reviews}
                    />
                    <Images
                        images={gig.images}
                        title={gig.title}
                        allowDelete={false}
                    />
                    {/* <h2 className="font-semibold">About this gig</h2> */}
                    <Description
                        editable={false}
                        initialContent={gig.description}
                        gigId={gig._id}
                    //className="pb-40 2xl:px-[200px] xl:px-[90px] xs:px-[17px]"
                    />
                    <div className="border border-zinc-400 p-4 space-y-2 rounded-2xl">
                        <div className="flex space-x-2">
                            <Info />
                            <h4>Delivery preferences</h4>
                        </div>
                        <p>Please communicate any preferences or concerns regarding the utilization of AI tools in the fulfillment and/or delivery of your request.</p>
                    </div>
                    <SellerDetails
                        seller={gig.seller}
                        reviews={reviews}
                        lastFulFilmentTime={gig.lastFulfilment?.fulfilmentTime}
                        languages={gig.seller.languages}
                    />
                    {/* 
                    <Reviews
                        reviews={reviewsFull}
                    />
                     */}
                    <AddReview
                        gigId={gig._id}
                        sellerId={gig.seller._id}
                    />
                </div>
                <Offers
                    offers={offers}
                    sellerId={gig.seller._id}
                    editUrl={editUrl}
                />
            </div>
        </div>
    )
}

export default GigPage