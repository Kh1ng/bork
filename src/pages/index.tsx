import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Image from "next/image";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingDog, LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import Feed from "~/components/feed";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      console.log("ZOD:", ZodError);
      toast.error("Your posts are too long, or too fast!");
    },
  });
  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.imageUrl.toString()}
        alt="profile image"
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
        // placeholder="blur"
      />
      <input
        className="grow bg-transparent outline-none"
        placeholder="!!!bork here!!!"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input != "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input != "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>bork</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded)
    return (
      <div className="flex h-screen w-screen items-center justify-center align-middle">
        <LoadingDog />
      </div>
    );

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <CreatePost />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
