import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
    handler: async (ctx) => {
        const categories = await ctx.db.query("categories").collect();

        const categoriesWithSubcategoriesRelations = categories.map((category) => {
            return ctx.db
                .query("subcategories")
                .withIndex("by_category", (q) =>
                    q
                        .eq("categoryId", category._id)
                )
                .collect()
                .then((subcategories) => {
                    return {
                        ...category,
                        subcategories: subcategories,
                    };
                });
        });

        const categoriesWithSubcategories = await Promise.all(categoriesWithSubcategoriesRelations);

        return categoriesWithSubcategories;
    }
});