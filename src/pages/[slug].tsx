import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "../components/postview";

const ProfileFeed = (props: { userID: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userID: props.userID,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="tw-feed-scroller flex max-h-[calc(100vh-320px)] flex-col overflow-y-auto bg-[#f7fbfe]">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading, error } = api.profile.getUserByUsername.useQuery(
    { username },
    {
      retry: false,
      enabled: username !== "anonymous",
    },
  );

  if (username === "anonymous") {
    return <div>Something is borked, page not found.</div>;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !data) {
    return <div>Something is borked, page not found.</div>;
  }
  
  const profileImageUrl = data.profileImageUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${username}`;
  const displayUsername = data.username || username;
  const userId = data.id;
  
  return (
    <div>
      <Head>
        <title>{displayUsername}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-gradient-to-r from-[#8ecdf1] via-[#a4d8f4] to-[#d9edf7]">
          <Image
            src={profileImageUrl}
            alt={`${displayUsername}'s profile pic`}
            width={128}
            height={128}
            sizes="(max-height: 128px) 128px, 64px"
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-white bg-white"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold text-slate-900">{`@${displayUsername}`}</div>
        <div className="w-full border-b tw-divider" />
        <ProfileFeed userID={userId} />
      </PageLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{ username: string }> = async (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return Promise.resolve({
      notFound: true,
    });
  }

  //to match usernames[], remove @
  const username = slug.replace("@", "");

  if (username.length === 0 || username === "anonymous") {
    return Promise.resolve({
      notFound: true,
    });
  }

  return Promise.resolve({
    props: {
      username,
    },
  });
};

export default ProfilePage;
