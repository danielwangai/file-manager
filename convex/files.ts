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
        fileId: v.id("_storage"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("must be logged in to manage files");
        }

        const isAuthorized = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

        if (!isAuthorized) {
            throw new ConvexError("your are not authorized to access this organization.")
        }

        await ctx.db.insert("files", {
            name: args.name,
            fileId: args.fileId,
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

        const isAuthorized = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!isAuthorized) {
            return [];
        }

        return !!identity ? await ctx.db
            .query("files")
            .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
             .collect() : [];
    }
});

export const deleteFile = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("must be authenticated to perform this action.");
        }

        // TODO: must be creator or admin to delete
        // find file
        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new ConvexError("file does not exist")
        }

        const isAuthorized = await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId)
        if (!isAuthorized) {
            throw new ConvexError("must be part of the organization or owner of personal account to delete.");
        }

        // delete file
        await ctx.db.delete(args.fileId);
    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
