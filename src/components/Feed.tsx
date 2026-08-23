import { api } from "~/utils/api";
import { LoadingDog } from "~/components/Loading";
import { PostView } from "./PostView";

const Feed = () => {
  const { data: posts, error, isLoading, refetch } = api.posts.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center" aria-label="Loading public borks">
        <LoadingDog />
      </div>
    );
  }

  if (error || !posts) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="font-bold">Couldn’t load the public borks.</h2>
        <p className="bork-muted mt-2 text-sm">The feed is unavailable right now.</p>
        <button type="button" className="bork-secondary-btn mt-5" onClick={() => void refetch?.()}>
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <h2 className="font-bold">The park is quiet.</h2>
        <p className="bork-muted mt-2 text-sm">No public borks yet.</p>
      </div>
    );
  }

  return (
    <section aria-label="Public borks" className="bork-scrollbar">
      {posts.map((fullPost) => <PostView {...fullPost} key={fullPost.post.id} />)}
    </section>
  );
};

export default Feed;
