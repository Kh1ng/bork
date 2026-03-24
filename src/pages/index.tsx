import { useUser } from '@supabase/auth-helpers-react'
import { type NextPage } from "next";
import Link from "next/link";

import Image from "next/image";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import Feed from "~/components/feed";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const user = useUser();
  const ctx = api.useUtils();
  const { data: currentProfile } = api.profile.getCurrentProfile.useQuery(undefined, {
    enabled: !!user,
  });
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      toast.success("Borked!");
    },
    onError: (_e) => {
      console.log("ZOD:", ZodError);
      toast.error("Your posts is too long!");
    },
  });
  const [input, setInput] = useState("");

  if (!user) return null;

  const rawMetadata: unknown = user.user_metadata;
  const metadata =
    typeof rawMetadata === "object" && rawMetadata !== null
      ? (rawMetadata as Record<string, unknown>)
      : undefined;
  const profileAvatar = typeof currentProfile?.imageUrl === "string" ? currentProfile.imageUrl : undefined;
  const metadataAvatarUrl = typeof metadata?.avatar_url === "string" ? metadata.avatar_url : undefined;
  const metadataAvatar = typeof metadata?.avatar === "string" ? metadata.avatar : undefined;

  const profileImageUrl = profileAvatar ||
    metadataAvatarUrl ||
    metadataAvatar ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email || 'default'}`;

  return (
    <div className="flex w-full items-start gap-3">
      <Image
        src={profileImageUrl}
        alt="profile image"
        className="h-12 w-12 rounded-full border border-sky-200"
        width={56}
        height={56}
      />
      <input
        className="tw-input grow"
        placeholder="What's happening, pup?"
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
        <button className="tw-primary-btn" onClick={() => mutate({ content: input })}>bork</button>
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
  const user = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  return (
    <PageLayout>
      <div className="flex border-b bg-white p-4 tw-divider">
        {!user && (
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm tw-muted">Viewing public borks. Sign in to post.</p>
            <Link href="/signin" className="tw-primary-btn">
              Sign in
            </Link>
          </div>
        )}
        {user && <CreatePost />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
