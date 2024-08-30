import {mutation, MutationCtx, query, QueryCtx} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {getUser} from "./users";

export const hasAccessToOrg = async (ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) => {
    const user = await getUser(ctx, tokenIdentifier);
    return user.orgIds.includes(orgId)
        || user.tokenIdentifier.includes(orgId); // for files created on personal accounts
}

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

        const isAuthorized = hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

        if (!isAuthorized) {
            throw new ConvexError("your are not authorized to access this organization.")
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
