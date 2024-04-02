import { Doc, Id } from "@/convex/_generated/dataModel";

export type ImageWithUrlType = Doc<"gigMedia"> & {
    url: string
};

export type FullGigType = Doc<"gigs"> & {
    storageId?: Id<"_storage"> | undefined;
    favorited: boolean;
    offer: Doc<"offers">;
    reviews: Doc<"reviews">[];
    seller: Doc<"users">;
}

export type MessageWithUserType = Doc<"messages"> & {
    user: Doc<"users">
};

export type GigWithImageType = Doc<"gigs"> & {
    images: Doc<"gigMedia">[]
};


export type UserWithCountryType = Doc<"users"> & {
    country: Doc<"countries">
};

export type ReviewFullType = Doc<"reviews"> & {
    author: UserWithCountryType
    image: ImageWithUrlType
    offers: Doc<"offers">[]
    gig: Doc<"gigs">
};

export type CategoriesFullType = Doc<"categories"> & {

};