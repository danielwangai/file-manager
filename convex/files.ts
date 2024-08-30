import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("must be logged in to manage files");
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
        });
    }
});

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return []
        }

        return !!identity ? await ctx.db
            .query("files")
            .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
             .collect() : [];
    }
})
