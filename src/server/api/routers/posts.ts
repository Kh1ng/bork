import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

//filter out unneeded user info, if pfp is default the replace with random dog pic
const filterUserInfo = (user: User) => {
  interface dogApiResponse {
    message: string;
  }

  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    //   user.profileImageUrl === "https://www.gravatar.com/avatar?d=mp"         I would like this to get a random dog pic from the dog.ceo api
    //     ? async () => {
    //         const randomDog = await fetch(
    //           "https://dog.ceo/api/breeds/image/random"
    //         );
    //         const data: dogApiResponse =
    //           (await randomDog.json()) as dogApiResponse;
    //         if (!data) {
    //           return "https://www.gravatar.com/avatar?d=mp";
    //         } else {
    //           return data?.message;
    //         }
    //       }
    //     : user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
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
});
