import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type UserProfile } from "~/server/helpers/filterUserInfo";
import { env } from "~/env.mjs";
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

type ProfileRecord = {
  userId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

const getStringMetadata = (
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

const addUserDataToPosts = async (posts: PostRecord[], _ctx: Context) => {
  const authorIds = [...new Set(posts.map((post) => post.authorID))];
  let profiles: ProfileRecord[] = [];

  if (authorIds.length > 0) {
    const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Profile`);
    url.searchParams.append("select", "userId,username,firstName,lastName,imageUrl");
    
    // Use OR filter for multiple IDs
    const orFilters = authorIds.map(id => `userId.eq.${id}`).join(",");
    url.searchParams.append("or", `(${orFilters})`);

    const response = await fetch(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Unable to load profile data: ${errorText}`,
      });
    }

    profiles = (await response.json()) as ProfileRecord[];
  }

  return posts.map((post) => {
    const author = profiles.find((profile) => profile.userId === post.authorID);

    if (!author) {
      return {
        post,
        author: {
          id: post.authorID,
          username: "anonymous",
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        } as UserProfile,
      };
    }

    return {
      post,
      author: {
        id: author.userId,
        username: author.username || "anonymous",
        firstName: author.firstName,
        lastName: author.lastName,
        profileImageUrl: author.imageUrl,
      } as UserProfile,
    };
  });
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Use direct fetch to avoid Supabase client JWT signature issues
    const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Post`);
    url.searchParams.append("select", "id,createdAt,content,authorID");
    url.searchParams.append("order", "createdAt.desc");
    url.searchParams.append("limit", "100");

    const response = await fetch(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Unable to load posts: ${response.status} ${errorText}`,
      });
    }

    const data = (await response.json()) as PostRecord[];
    return addUserDataToPosts(data, ctx);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Post`);
      url.searchParams.append("select", "id,createdAt,content,authorID");
      url.searchParams.append("id", `eq.${input.id}`);

      const response = await fetch(url.toString(), {
        headers: {
          apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load post: ${response.status} ${errorText}`,
        });
      }

      const data = (await response.json()) as PostRecord[];
      if (!data || data.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await addUserDataToPosts([data[0]!], ctx);
      return result[0];
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Post`);
      url.searchParams.append("select", "id,createdAt,content,authorID");
      url.searchParams.append("authorID", `eq.${input.userID}`);
      url.searchParams.append("order", "createdAt.desc");
      url.searchParams.append("limit", "100");

      const response = await fetch(url.toString(), {
        headers: {
          apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load user posts: ${response.status} ${errorText}`,
        });
      }

      const data = (await response.json()) as PostRecord[];
      return addUserDataToPosts(data ?? [], ctx);
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280), // 280 is the max length of a tweet
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const authorID = ctx.userId;

      const {
        data: { user },
      } = await ctx.supabase.auth.getUser();

      const userMetadata = user?.user_metadata as Record<string, unknown> | undefined;

      const profilePayload = {
        userId: authorID,
        username: getStringMetadata(userMetadata, "username") ?? null,
        firstName: getStringMetadata(userMetadata, "firstName") ?? null,
        lastName: getStringMetadata(userMetadata, "lastName") ?? null,
        imageUrl:
          getStringMetadata(userMetadata, "avatar_url") ??
          getStringMetadata(userMetadata, "picture") ??
          null,
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
