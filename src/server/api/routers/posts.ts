import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";
import type { Post } from "@prisma/client";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

import filterUserInfo from "~/server/helpers/filterUserInfo";

const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorID);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserInfo);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorID);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorID}`,
      });
    }
    if (!author.username) {
      if (!author.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no external accounts: ${author.id}`,
        });
      }
      author.username = author.id;
    }
    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

// Create a new ratelimiter, that allows 3 requests per min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

const assignPic = async (user: User) => {
  interface dogApiResponse {
    message: string;
    status: string;
  }
  if (user.profileImageUrl === "https://www.gravatar.com/avatar?d=mp") {
    const randomDog = await fetch("https://dog.ceo/api/breeds/image/random");
    console.log(randomDog);
    // let data: dogApiResponse;
    // if (randomDog && data.status === "success") {
    //   data = randomDog.json();
    //   return data.message;
    // }
  }
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorID),
        limit: 100,
      })
    ).map(filterUserInfo);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorID);

      if (!author || !author.username)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToPosts([post]))[0];
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: {
            authorID: input.userID,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
    ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280), // 280 is the max length of a tweet
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorID = ctx.userId;

      const { success } = await ratelimit.limit(authorID);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          authorID: authorID,
          content: input.content,
        },
      });

      return post;
    }),
});
