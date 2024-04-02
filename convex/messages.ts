import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
    args: { text: v.optional(v.string()), userId: v.id("users"), imageUrl: v.optional(v.string()), seen: v.boolean(), conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const { text, userId, imageUrl, seen, conversationId } = args;
        await ctx.db.insert("messages", {
            text,
            userId,
            imageUrl,
            seen,
            conversationId,
        });
    },
});

export const get = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("messages")
            .collect();
    },
});

export const getLast = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const message = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .first();
        return message;
    },
});