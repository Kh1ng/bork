import Link from "next/link";
import React from "react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from "next/image";

const LeftBar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleSignOut = () => {
    void supabase.auth.signOut();
  };

  const username = user?.user_metadata?.username as string || user?.email?.split('@')[0] || 'user';
  const profileImageUrl = (user?.user_metadata?.avatar_url as string) ||
    (user?.user_metadata?.avatar as string) ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.email || 'default'}`;

  if (!user)
    return (
      <div className="tw-panel flex h-full w-full min-w-36 flex-col gap-6 border bg-white/95 px-3 py-4 shadow-md">
        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-[0.2em] tw-muted">bork</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link className="tw-nav-link" href="/">
            Home
          </Link>
          <Link className="tw-nav-link" href="https://github.com/kh1ng/bork">
            About
          </Link>
        </nav>
        <div className="tw-panel mt-auto border p-3">
          <p className="text-sm tw-muted">Read-only mode.</p>
          <p className="text-xs tw-muted">Sign in to bork into the timeline.</p>
        </div>
      </div>
    );
  else
    return (
      <div className="tw-panel flex h-full w-full flex-col gap-6 border bg-white/95 px-3 py-4 shadow-md">
        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-[0.2em] tw-muted">bork</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link className="tw-nav-link" href="/">
            Home
          </Link>
          <Link className="tw-nav-link" href="https://github.com/kh1ng/bork">
            About
          </Link>
        </nav>
        <div className="tw-panel mt-auto min-w-24 border p-3">
          <div className="flex items-center gap-3">
            <Image
              src={profileImageUrl}
              className="h-12 w-12 rounded-full border border-sky-200"
              alt={`@${username}'s profile picture`}
              width={48}
              height={48}
            />
            <div className="min-w-0">
              <Link className="truncate text-sm font-semibold text-slate-900" href={`/${username}`}>
                {`@${username}`}
              </Link>
              <p className="text-xs tw-muted">Signed in</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link className="tw-nav-link !px-2 !py-1 text-xs" href="/UserSettingsPage">
              Account
            </Link>
            <button className="tw-nav-link !px-2 !py-1 text-xs" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
};

export default LeftBar;
