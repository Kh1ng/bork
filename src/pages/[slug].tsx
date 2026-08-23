import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/Loading";
import { PageLayout } from "~/components/PageLayout";
import { PostView } from "~/components/PostView";
import { ProfileAvatar } from "~/components/ProfileAvatar";
import { getAvatarUrl } from "~/lib/profile";
import { api } from "~/utils/api";

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data: posts, error, isLoading, refetch } = api.posts.getPostsByUserId.useQuery({ userId });

  if (isLoading) return <div className="min-h-64"><LoadingPage /></div>;
  if (error) {
    return <div className="px-6 py-14 text-center"><h2 className="font-bold">This profile’s borks are unavailable right now.</h2><p className="bork-muted mt-2 text-sm">Try again in a moment.</p><button type="button" className="bork-secondary-btn mt-5" onClick={() => void refetch()}>Try again</button></div>;
  }
  if (!posts || posts.length === 0) {
    return <div className="px-6 py-14 text-center"><h2 className="font-bold">No borks yet.</h2><p className="bork-muted mt-2 text-sm">This profile is keeping things quiet.</p></div>;
  }

  return <section aria-label="Profile borks">{posts.map((post) => <PostView {...post} key={post.post.id} />)}</section>;
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: profile, isLoading, error } = api.profile.getUserByUsername.useQuery(
    { username },
    { retry: false },
  );

  if (isLoading) return <PageLayout><LoadingPage /></PageLayout>;
  if (error || !profile) {
    return <PageLayout><div className="px-6 py-16 text-center"><h1 className="text-xl font-bold">Profile not found.</h1><p className="bork-muted mt-2">That trail has gone cold.</p></div></PageLayout>;
  }

  const displayUsername = profile.username || username;
  const profileImageUrl = getAvatarUrl({ profileImageUrl: profile.profileImageUrl, seed: displayUsername });
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return (
    <PageLayout>
      <Head><title>@{displayUsername} · Bork</title></Head>
      <header className="border-b bork-divider">
        <div className="h-28 bork-surface-raised" />
        <div className="px-5 pb-6 md:px-6">
          <div className="-mt-12 w-fit rounded-full p-1 bork-surface"><ProfileAvatar src={profileImageUrl} username={displayUsername} size={104} priority /></div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.025em]">@{displayUsername}</h1>
          {fullName && <p className="bork-muted mt-1 text-sm">{fullName}</p>}
        </div>
      </header>
      <ProfileFeed userId={profile.id} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{ username: string }> = (context) => {
  const slug = context.params?.slug;
  if (typeof slug !== "string") return Promise.resolve({ notFound: true });

  const username = slug.replace(/^@/, "");
  return Promise.resolve(username.length > 0 && username !== "anonymous"
    ? { props: { username } }
    : { notFound: true });
};

export default ProfilePage;
