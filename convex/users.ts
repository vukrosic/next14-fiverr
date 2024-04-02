import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import Stripe from "stripe";
import { api, internal } from "./_generated/api";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before.
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value.
            if (user.username !== identity.nickname) {
                await ctx.db.patch(user._id, { username: identity.nickname });
            }
            return user._id;
        }

        // If it's a new identity, create a new `User`.
        const userId = await ctx.db.insert("users", {
            fullName: identity.name!,
            tokenIdentifier: identity.tokenIdentifier,
            title: "",
            about: "",
            username: identity.nickname!,
            profileImageUrl: identity.profileUrl,
        });

        return userId;
    },
});


export const getCurrentUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        // throw new Error("Unauthenticated call to query");
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        return user;
    }
});


export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        return user;
    },
});


export const getStripeAccountId = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user.stripeAccountId;
    },
});


export const createStripe = action({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        const user = await ctx.runQuery(api.users.getCurrentUser);
        if (user === null) {
            return;
        }
        const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
            apiVersion: "2023-10-16",
        });

        let accountId: string | null = await ctx.runQuery(internal.users.getStripeAccountId, { userId: user._id });

        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'standard',
            });
            accountId = account.id;

            await ctx.runMutation(internal.users.setStripeAccountId, { userId: user._id, stripeAccountId: accountId });
        }


        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: process.env.NEXT_PUBLIC_HOSTING_URL,
            return_url: `${process.env.NEXT_PUBLIC_HOSTING_URL}/stripe-account-setup-complete/${user._id}`,
            type: 'account_onboarding',
        });

        return accountLink.url;
    },
});


export const setStripeAccountId = internalMutation({
    args: { userId: v.id("users"), stripeAccountId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        await ctx.db.patch(args.userId, { stripeAccountId: args.stripeAccountId });
    },
});


export const updateStripeSetup = internalMutation({
    args: { id: v.id("users"), stripeAccountSetupComplete: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { stripeAccountSetupComplete: args.stripeAccountSetupComplete });
    },
});


export const getUserByUsername = query({
    args: { username: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.username === undefined) return null;
        if (!args.username) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username!))
            .unique();

        return user;
    },
});


export const getLanguagesByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const languages = await ctx.db
            .query("languages")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        return languages;
    },
});

export const getCountryByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const country = await ctx.db.query("countries")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .unique();

        if (!country) {
            throw new Error("Country not found");
        }
        return country;
    },
});