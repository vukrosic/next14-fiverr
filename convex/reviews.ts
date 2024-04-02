import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ExpressionOrValue } from "convex/server";

export const getByGig = query({
    args: { gigId: v.id("gigs") },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_gigId", (q) => q.eq("gigId", args.gigId))
            .collect();
        return reviews;
    },
});

export const getFullByGig = query({
    args: { gigId: v.id("gigs") },
    handler: async (ctx, args) => {

        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_gigId", (q) => q.eq("gigId", args.gigId))
            .collect();

        const reviewsFullType = await Promise.all(reviews.map(async (review) => {

            const gig = await ctx.db.query("gigs")
                .filter((q) => q.eq(q.field("_id"), review.gigId))
                .unique();

            if (!gig) {
                throw new Error("Gig not found");
            }

            const image = await ctx.db.query("gigMedia")
                .withIndex("by_gigId", (q) => q.eq("gigId", gig._id))
                .first();

            if (!image) {
                throw new Error("Image not found");
            }

            const imageUrl = await ctx.storage.getUrl(image.storageId);

            if (!imageUrl) {
                throw new Error("Image not found");
            }

            const offers = await ctx.db.query("offers")
                .withIndex("by_gigId", (q) => q.eq("gigId", gig._id))
                .collect();

            if (!offers) {
                throw new Error("Offers not found");
            }

            const imageWithUrl = { ...image, url: imageUrl };

            // get author country
            const author = await ctx.db.query("users")
                .filter((q) => q.eq(q.field("_id"), review.authorId))
                .unique();

            if (!author) {
                throw new Error("Author not found");
            }

            const country = await ctx.db.query("countries")
                .withIndex("by_userId", (q) => q.eq("userId", review.sellerId))
                .unique();

            if (!country) {
                throw new Error("Country not found");
            }

            return {
                ...review,
                gig,
                image: imageWithUrl,
                offers,
                author: {
                    ...author,
                    country,
                },
            }
        }));

        return reviewsFullType;
    },
});


export const getBySellerName = query({
    args: { sellerName: v.string() },
    handler: async (ctx, args) => {
        const seller = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.sellerName))
            .unique();

        if (!seller) {
            throw new Error("Seller not found");
        }

        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_sellerId", (q) => q.eq("sellerId", seller._id))
            .collect();

        // if (!reviews) {
        //     throw new Error("Reviews not found");
        // }

        // for each review, get the order
        const reviewsFullType = await Promise.all(reviews.map(async (review) => {

            const gig = await ctx.db.query("gigs")
                .filter((q) => q.eq(q.field("_id"), review.gigId))
                .unique();

            if (!gig) {
                throw new Error("Gig not found");
            }

            const image = await ctx.db.query("gigMedia")
                .withIndex("by_gigId", (q) => q.eq("gigId", gig._id))
                .first();

            if (!image) {
                throw new Error("Image not found");
            }

            const imageUrl = await ctx.storage.getUrl(image.storageId);

            if (!imageUrl) {
                throw new Error("Image not found");
            }

            const offers = await ctx.db.query("offers")
                .withIndex("by_gigId", (q) => q.eq("gigId", gig._id))
                .collect();

            if (!offers) {
                throw new Error("Offers not found");
            }

            const imageWithUrl = { ...image, url: imageUrl };

            // get author country
            const author = await ctx.db.query("users")
                .filter((q) => q.eq(q.field("_id"), review.authorId))
                .unique();

            if (!author) {
                throw new Error("Author not found");
            }

            const country = await ctx.db.query("countries")
                .withIndex("by_userId", (q) => q.eq("userId", seller._id))
                .unique();

            if (!country) {
                throw new Error("Country not found");
            }

            return {
                ...review,
                gig,
                image: imageWithUrl,
                offers,
                author: {
                    ...author,
                    country,
                },
            }
        }));

        return reviewsFullType;
    },
});


export const add = mutation({
    args: {
        gigId: v.id("gigs"),
        sellerId: v.id("users"),
        comment: v.string(),
        service_as_described: v.number(),
        recommend_to_a_friend: v.number(),
        communication_level: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const currentUser = await ctx.db.query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!currentUser) {
            throw new Error("User not found");
        }

        const review = await ctx.db.insert("reviews", {
            gigId: args.gigId,
            sellerId: args.sellerId,
            authorId: currentUser._id,
            comment: args.comment,
            service_as_described: args.service_as_described,
            recommend_to_a_friend: args.recommend_to_a_friend,
            communication_level: args.communication_level,
        });

        return review;
    },
});