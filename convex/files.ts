import {ActionCtx, mutation, MutationCtx, query, QueryCtx} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {getUser} from "./users";
import {fileTypes} from "./schema";

export const hasAccessToOrg = async (ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) => {
    const user = await getUser(ctx, tokenIdentifier);
    return user.orgIds.includes(orgId)
        || user.tokenIdentifier.includes(orgId); // for files created on personal accounts
}

export const addToFavorites = mutation({
    args: {
        fileId: v.id("files"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // each file added as favorite is a unique list of the user
        // get identity
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("must be logged in to manage files");
        }
        // must belong to organization to favorite a file
        const isAuthorized = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)

        if (!isAuthorized) {
            // TODO: delete file from favorites list
            throw new ConvexError("your are not authorized to access this organization.")
        }

        const user = await ctx.db.query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first()

        if (!user) {
            throw new ConvexError("must be logged in to manage files");
        }

        // cannot mark file as favorite more than once
        const favorite = await ctx.db.query("fileFavorites")
            .filter(
                (q) => q.and(
                    q.eq(q.field("fileId"), args.fileId),
                    q.eq(q.field("userId"), user._id))
            )
            .first()
        if(favorite) {
            throw new ConvexError("file already marked as favorite");
        }

        await ctx.db.insert("fileFavorites", {
            userId: user._id,
            fileId: args.fileId,
            orgId: args.orgId,
        })
    }
})

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes,
        // uploadedBy: v.id("users"),
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
            type: args.type,
            fileUrl: await ctx.storage.getUrl(args.fileId) ?? "",
            uploadedBy: identity.tokenIdentifier,
        });
    }
});

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const isAuthorized = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!isAuthorized) {
            return [];
        }

        const files = ctx.db
            .query("files")
            // .withSearchIndex("search_query", (q) => q.search("name", args.query ? args.query : "").eq("orgId", args.orgId))
            // .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
            // .collect();

        if (!args.query) {
            return files
                .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
                .collect()
        }

        return files
            .withSearchIndex("search_query", (q) => q.search("name", args.query ? args.query : "").eq("orgId", args.orgId))
            .collect()
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


