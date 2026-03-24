import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

type ProfileRecord = {
  userId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Profile`);
      url.searchParams.append("select", "userId,username,firstName,lastName,imageUrl");
      url.searchParams.append("username", `eq.${input.username}`);

      const response = await fetch(url.toString(), {
        headers: {
          apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load user profile: ${response.status} ${errorText}`,
        });
      }

      const data = (await response.json()) as ProfileRecord[];
      if (!data || data.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const profile = data[0];
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return {
        id: profile.userId,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileImageUrl: profile.imageUrl,
      };
    }),

  createOrUpdateProfile: privateProcedure
    .input(z.object({
      username: z.string().min(1).max(20).optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const { data, error } = await ctx.supabaseAdmin
        .from("Profile")
        .upsert(
          {
            userId: ctx.userId,
            username: input.username ?? null,
            firstName: input.firstName ?? null,
            lastName: input.lastName ?? null,
            imageUrl: input.imageUrl ?? null,
          },
          { onConflict: "userId" },
        )
        .select("userId, username, firstName, lastName, imageUrl")
        .single();

      if (error || !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to save profile: ${error?.message ?? "Unknown error"}`,
        });
      }

      return data;
    }),

  getCurrentProfile: privateProcedure
    .query(async ({ ctx }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const { data, error } = await ctx.supabaseAdmin
        .from("Profile")
        .select("userId, username, firstName, lastName, imageUrl")
        .eq("userId", ctx.userId)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load current profile: ${error.message}`,
        });
      }

      return data;
    }),
});
