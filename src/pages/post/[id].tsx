import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { LoadingDog } from "~/components/Loading";
import { PageLayout } from "~/components/PageLayout";
import { PostView } from "~/components/PostView";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps<{ id: string }> = (context) => {
  const id = context.params?.id;
  return typeof id === "string" && id.length > 0
    ? Promise.resolve({ props: { id } })
    : Promise.resolve({ notFound: true });
};

const SinglePost: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const { data: post, error, isLoading } = api.posts.getById.useQuery({ id });
  const title = post ? `${post.author.username ?? "anonymous"}: ${post.post.content}` : "Post · Bork";
  const isNotFound = error?.data?.code === "NOT_FOUND";

  return (
    <PageLayout>
      <Head><title>{title}</title></Head>
      <header className="border-b px-4 py-6 bork-divider md:px-6"><h1 className="text-2xl font-extrabold tracking-[-0.025em]">Bork</h1><p className="bork-muted mt-1 text-sm">One post from the public feed.</p></header>
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><LoadingDog /></div>
      ) : error && !isNotFound ? (
        <div className="px-6 py-16 text-center"><h2 className="font-bold">This bork is unavailable right now.</h2><p className="bork-muted mt-2 text-sm">Try again in a moment.</p></div>
      ) : !post || isNotFound ? (
        <div className="px-6 py-16 text-center"><h2 className="font-bold">Post not found.</h2><p className="bork-muted mt-2 text-sm">It may have wandered off.</p></div>
      ) : (
        <PostView {...post} />
      )}
    </PageLayout>
  );
};

export default SinglePost;
