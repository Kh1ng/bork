import Link from "next/link";
import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";

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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`\t · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
