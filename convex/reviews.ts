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