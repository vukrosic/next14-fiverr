import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import Stripe from "stripe";

export const addPrice = internalAction({
    args: {
        tier: v.union(v.literal("Basic"), v.literal("Standard"), v.literal("Premium")),
        price: v.number(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
            apiVersion: "2023-10-16",
        });

        const price = await stripe.prices.create({
            currency: 'usd',
            unit_amount: args.price * 100,
            product_data: {
                name: "[" + args.tier + "] " + args.title,
            },
        });

        return price;
    },
});