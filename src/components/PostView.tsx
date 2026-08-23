import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { getAvatarUrl } from "~/lib/profile";
import type { RouterOutputs } from "~/utils/api";
import { ProfileAvatar } from "./ProfileAvatar";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

/** Presents one post and keeps missing-profile fallbacks consistent across feeds. */
export const PostView = ({ post, author }: PostWithUser) => {
  const username = author.username ?? "anonymous";
  const profileImageUrl = getAvatarUrl({
    profileImageUrl: author.profileImageUrl,
    seed: username,
  });

  return (
    <article className="bork-post-row">
      <ProfileAvatar src={profileImageUrl} username={username} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          {author.username ? (
            <Link href={`/@${username}`} className="font-bold hover:underline">@{username}</Link>
          ) : (
            <span className="font-bold">@anonymous</span>
          )}
          <Link href={`/post/${post.id}`} className="bork-muted tabular-nums hover:underline">
            {dayjs(post.createdAt).fromNow()}
          </Link>
        </div>
        <p className="mt-2 max-w-[70ch] whitespace-pre-wrap text-[17px] leading-7">{post.content}</p>
      </div>
    </article>
  );
};

export default PostView;
