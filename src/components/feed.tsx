import { api } from "~/utils/api";
import { LoadingDog } from "~/components/loading";
import { PostView } from "./postview";

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex h-full w-full items-center justify-center align-middle">
        <LoadingDog />
      </div>
    );

  if (!data) return <div> Something went wrong! </div>;

  return (
    <div className="tw-feed-scroller flex max-h-[calc(100vh-140px)] flex-col overflow-y-auto bg-[#f7fbfe]">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default Feed;
