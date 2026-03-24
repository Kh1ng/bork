import { type GetServerSideProps, type InferGetServerSidePropsType, type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";

dayjs.extend(relativeTime);

export const getServerSideProps: GetServerSideProps<{ id: string }> = (context) => {
  const rawId = context.params?.id;

  if (typeof rawId !== "string" || rawId.length === 0) {
    return Promise.resolve({
      notFound: true,
    });
  }

  return Promise.resolve({
    props: {
      id: rawId,
    },
  });
};

const SinglePost: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({ id });

  const title = data ? `${data.author.username ?? "anonymous"}: ${data.post.content}` : "Post";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Social media for dog people" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="min-h-screen w-full max-w-2xl p-6">
          {isLoading ? (
            <div className="tw-muted">Loading post...</div>
          ) : !data ? (
            <div className="text-red-400">Post not found.</div>
          ) : (
            <article className="tw-panel border p-4">
              <div className="mb-2 text-sm tw-muted">
                @{data.author.username ?? "anonymous"} · {dayjs(data.post.createdAt).fromNow()}
              </div>
              <p className="tw-heading text-xl">{data.post.content}</p>
            </article>
          )}
        </div>
      </main>
    </>
  );
};

export default SinglePost;
