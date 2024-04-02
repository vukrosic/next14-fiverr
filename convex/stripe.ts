import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { api, internal } from "./_generated/api";

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


export const pay = action({
    args: { priceId: v.string(), title: v.string(), sellerId: v.id("users") },
    handler: async (ctx, args) => {

        const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
            apiVersion: "2023-10-16",
        });

        const domain = process.env.NEXT_PUBLIC_HOSTING_URL;

        const price = await stripe.prices.retrieve(args.priceId);

        if (price.unit_amount === null) {
            throw new Error("Error: Stripe price doesn't have unit_amount.");
        }

        const stripeAccountId: string | null = await ctx.runQuery(internal.users.getStripeAccountId, { userId: args.sellerId });

        if (stripeAccountId === null) {
            throw new Error("Error: Stripe account not found.");
        }

        const session: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create(
            {
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: args.title,
                            },
                            unit_amount: price.unit_amount,
                        },
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: price.unit_amount * 0.1,
                },
                success_url: `${domain}`,
                cancel_url: `${domain}`,
            },
            {
                stripeAccount: stripeAccountId,
            }
        );

        return session.url;
    },
});


export const setStripeAccountSetupComplete = action({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
            apiVersion: "2023-10-16",
        });

        const user = await ctx.runQuery(api.users.get, { id: args.userId });
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.stripeAccountId) {
            throw new Error("Stripe account not found");
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);

        if (account.charges_enabled) {
            await ctx.runMutation(internal.users.updateStripeSetup, { id: args.userId, stripeAccountSetupComplete: true });
        }
        else {
            throw new Error("Stripe account not setup");
        }
    },
});