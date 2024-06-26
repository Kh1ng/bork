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
    <div className="flex flex-col overflow-y-scroll bg-black">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default Feed;
