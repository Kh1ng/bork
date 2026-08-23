import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  profileFromAuthUser,
  PROFILE_SELECT,
  type ProfileRecord,
  userProfileFromRecord,
} from "~/lib/profile";
import { borkContentSchema } from "~/lib/bork";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
  type createTRPCContext,
} from "~/server/api/trpc";

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

type PostRecord = {
  id: string;
  createdAt: string;
  content: string;
  authorID: string;
};

const addUserDataToPosts = async (posts: PostRecord[], ctx: Context) => {
  const authorIds = [...new Set(posts.map((post) => post.authorID))];
  let profiles: ProfileRecord[] = [];

  if (authorIds.length > 0) {
    const { data: profileRows, error } = await ctx.supabasePublic
      .from("Profile")
      .select(PROFILE_SELECT)
      .in("userId", authorIds);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Unable to load profile data: ${error.message}`,
      });
    }

    profiles = profileRows ?? [];
  }

  return posts.map((post) => {
    const author = profiles.find((profile) => profile.userId === post.authorID);

    if (!author) {
      return {
        post,
        author: {
          id: post.authorID,
          username: null,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        },
      };
    }

    return {
      post,
      author: userProfileFromRecord(author),
    };
  });
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { data: posts, error } = await ctx.supabasePublic
      .from("Post")
      .select("id, createdAt, content, authorID")
      .order("createdAt", { ascending: false })
      .limit(100);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Unable to load posts: ${error.message}`,
      });
    }

    return addUserDataToPosts((posts ?? []), ctx);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data: post, error } = await ctx.supabasePublic
        .from("Post")
        .select("id, createdAt, content, authorID")
        .eq("id", input.id)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load post: ${error.message}`,
        });
      }

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const result = await addUserDataToPosts([post], ctx);
      return result[0];
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data: posts, error } = await ctx.supabasePublic
        .from("Post")
        .select("id, createdAt, content, authorID")
        .eq("authorID", input.userId)
        .order("createdAt", { ascending: false })
        .limit(100);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load user posts: ${error.message}`,
        });
      }

      return addUserDataToPosts((posts ?? []), ctx);
    }),

  create: privateProcedure
    .input(
      z.object({
        content: borkContentSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorID = ctx.userId;

      const {
        data: { user },
      } = await ctx.supabase.auth.getUser();

      const userProfile = user
        ? profileFromAuthUser(user)
        : {
            id: authorID,
            username: null,
            firstName: null,
            lastName: null,
            profileImageUrl: null,
          };

      const profilePayload: ProfileRecord = {
        userId: userProfile.id,
        username: userProfile.username,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        imageUrl: userProfile.profileImageUrl,
      };

      const { error: profileError } = await ctx.supabaseAdmin
        .from("Profile")
        .upsert(profilePayload, { onConflict: "userId" });

      if (profileError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to upsert profile: ${profileError.message}`,
        });
      }

      const { data: createdPost, error: createPostError } = await ctx.supabaseAdmin
        .from("Post")
        .insert({
          authorID,
          content: input.content,
        })
        .select("id, createdAt, content, authorID")
        .single();

      if (createPostError || !createdPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to create post: ${createPostError?.message ?? "Unknown error"}`,
        });
      }

      return createdPost;
    }),
});
