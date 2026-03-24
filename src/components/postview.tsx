import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const username = author.username || 'anonymous';
  const hasProfile = username !== 'anonymous';
  const profileImageUrl = author.profileImageUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${username}`;

  return (
    <div key={post.id} className="flex gap-3 border-b p-4 transition-colors hover:bg-[#ecf6fc] tw-divider">
      <Image
        src={profileImageUrl}
        className="h-12 w-12 rounded-full border border-sky-200"
        alt={`@${username}'s profile picture`}
        width={48}
        height={48}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {hasProfile ? (
            <Link href={`/@${username}`} className="font-semibold text-slate-900 hover:underline">
              <span>{`@${username}`}</span>
            </Link>
          ) : (
            <span className="font-semibold text-slate-900">{`@${username}`}</span>
          )}
          <Link href={`/post/${post.id}`} className="tw-muted hover:underline">
            <span>{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-lg leading-relaxed text-slate-800">{post.content}</p>
      </div>
    </div>
  );
};

export default PostView;
