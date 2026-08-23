import { useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Feed from "~/components/Feed";
import { LoadingSpinner } from "~/components/Loading";
import { PageLayout } from "~/components/PageLayout";
import { ProfileAvatar } from "~/components/ProfileAvatar";
import { borkContentSchema, BORK_MAX_LENGTH } from "~/lib/bork";
import { getAvatarUrl } from "~/lib/profile";
import { api } from "~/utils/api";

const CreatePost = () => {
  const user = useUser();
  const utils = api.useUtils();
  const [input, setInput] = useState("");
  const { data: currentProfile } = api.profile.getCurrentProfile.useQuery(undefined, { enabled: !!user });
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void utils.posts.getAll.invalidate();
      toast.success("Bork posted.");
    },
    onError: () => toast.error("Couldn’t publish that bork. Try again."),
  });

  if (!user) return null;

  const profileImageUrl = getAvatarUrl({
    profileImageUrl: currentProfile?.imageUrl,
    metadata: user.user_metadata,
    seed: user.email,
  });
  const savedUsername: unknown = currentProfile?.username;
  const username =
    (typeof savedUsername === "string" && savedUsername) ||
    user.email?.split("@")[0] ||
    "user";
  const parsedContent = borkContentSchema.safeParse(input);

  const publish = () => {
    if (parsedContent.success) mutate({ content: parsedContent.data });
  };

  return (
    <form className="flex gap-3 px-4 py-5 md:px-6" onSubmit={(event) => { event.preventDefault(); publish(); }}>
      <ProfileAvatar src={profileImageUrl} username={username} size={48} />
      <div className="min-w-0 flex-1">
        <label htmlFor="new-bork" className="sr-only">Write a bork</label>
        <textarea
          id="new-bork"
          className="bork-input min-h-[92px] resize-none border-0 !bg-transparent !px-0 !py-1 text-lg leading-7"
          placeholder="What’s happening, pup?"
          value={input}
          maxLength={BORK_MAX_LENGTH}
          disabled={isPosting}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              publish();
            }
          }}
        />
        <div className="mt-3 flex items-center justify-between border-t pt-3 bork-divider">
          <span className="bork-muted text-xs">Short posts for good dogs and their people.</span>
          <button type="submit" className="bork-primary-btn min-w-20" disabled={!parsedContent.success || isPosting}>
            {isPosting ? <LoadingSpinner size={18} /> : "BORK"}
          </button>
        </div>
      </div>
    </form>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  return (
    <PageLayout>
      <header className="border-b px-4 py-6 bork-divider md:px-6">
        <h1 className="text-2xl font-extrabold tracking-[-0.025em]">Public borks</h1>
        <p className="bork-muted mt-1 text-sm">The neighborhood feed, newest first.</p>
      </header>
      <section className="border-b bork-divider bork-surface-raised" aria-label={user ? "Create a bork" : "Sign in prompt"}>
        {user ? (
          <CreatePost />
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center md:px-6">
            <div>
              <h2 className="font-bold">Reading the public feed.</h2>
              <p className="bork-muted mt-1 text-sm">Sign in by email to post.</p>
            </div>
            <Link href="/signin" className="bork-primary-btn shrink-0">Sign in</Link>
          </div>
        )}
      </section>
      <Feed />
    </PageLayout>
  );
};

export default Home;
