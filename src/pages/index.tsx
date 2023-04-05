import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Image from "next/image";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
        // placeholder="blur"
      />
      <input
        className="grow bg-transparent outline-none"
        placeholder="Bork here!!!"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="align-center flex gap-3 border-b border-slate-400 p-4"
    >
      <Image
        className="h-14 w-14 rounded-full"
        src={author.profileImageUrl}
        alt="profile image"
        width={56}
        height={56}
        // placeholder="blur"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 font-bold text-cyan-100">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`\t · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div> Loading... </div>;
  if (!data) return <div> Something went wrong! </div>;

  return (
    <>
      <Head>
        <title>Bork</title>
        <meta name="description" content="Social media for dog people" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && <SignInButton />}
            {!!user.isSignedIn && <CreatePost />}
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
