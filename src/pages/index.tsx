import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import Image from "next/image";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingDog, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import Feed from "~/components/feed";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const { user } = useUser();
  const ctx = api.useUtils();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      toast.success("Borked!");
    },
    onError: (e) => {
      console.log("ZOD:", ZodError);
      toast.error("Your posts is too long!");
    },
  });
  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-2">
      <Image
        src={user?.imageUrl.toString()}
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
      <div className="flex border-b border-slate-400 bg-black p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <CreatePost />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
