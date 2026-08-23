import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PROFILE_SELECT, userProfileFromRecord } from "~/lib/profile";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data: profile, error } = await ctx.supabasePublic
        .from("Profile")
        .select(PROFILE_SELECT)
        .eq("username", input.username)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load user profile: ${error.message}`,
        });
      }

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return userProfileFromRecord(profile);
    }),

  createOrUpdateProfile: privateProcedure
    .input(z.object({
      username: z.string().min(1).max(20).optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: savedProfile, error } = await ctx.supabaseAdmin
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
        .select(PROFILE_SELECT)
        .single();

      if (error || !savedProfile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to save profile: ${error?.message ?? "Unknown error"}`,
        });
      }

      return savedProfile;
    }),

  getCurrentProfile: privateProcedure
    .query(async ({ ctx }) => {
      const { data: profile, error } = await ctx.supabaseAdmin
        .from("Profile")
        .select(PROFILE_SELECT)
        .eq("userId", ctx.userId)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unable to load current profile: ${error.message}`,
        });
      }

      return profile;
    }),
});
