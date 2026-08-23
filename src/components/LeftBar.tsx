import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { getAvatarUrl } from "~/lib/profile";
import { useTheme } from "~/lib/theme";
import { ProfileAvatar } from "./ProfileAvatar";

type IconName = "feed" | "profile" | "settings" | "source" | "theme";

const Icon = ({ name }: { name: IconName }) => {
  const paths: Record<IconName, ReactNode> = {
    feed: <path d="M4 5.5h16M4 12h16M4 18.5h10" />,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    source: <path d="m9 18-6-6 6-6m6 0 6 6-6 6" />,
    theme: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const Brand = () => (
  <Link href="/" className="flex w-fit items-center gap-3 rounded-lg" aria-label="Bork home">
    <Image src="/favicon.ico" alt="" width={42} height={42} className="h-10 w-10 object-contain" priority />
    <span className="text-2xl font-extrabold tracking-[-0.03em]">Bork</span>
  </Link>
);

const NavLink = ({ href, label, icon, current }: { href: string; label: string; icon: IconName; current?: boolean }) => (
  <Link className="bork-nav-link" href={href} aria-current={current ? "page" : undefined}>
    <Icon name={icon} /><span>{label}</span>
  </Link>
);

const userName = (user: ReturnType<typeof useUser>) =>
  (typeof user?.user_metadata?.username === "string" && user.user_metadata.username) ||
  user?.email?.split("@")[0] ||
  "user";

const LeftBar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const username = userName(user);
  const profileImageUrl = getAvatarUrl({ metadata: user?.user_metadata, seed: user?.email });

  return (
    <div className="flex h-full flex-col px-4 py-8">
      <Brand />
      <nav className="mt-9 flex flex-col gap-1" aria-label="Primary navigation">
        <NavLink href="/" label="Feed" icon="feed" current={router.pathname === "/"} />
        {user && <NavLink href={`/@${username}`} label="Profile" icon="profile" current={router.pathname === "/[slug]"} />}
        <NavLink href="/UserSettingsPage" label="Settings" icon="settings" current={router.pathname === "/UserSettingsPage"} />
        <a className="bork-nav-link" href="https://github.com/kh1ng/bork" target="_blank" rel="noreferrer"><Icon name="source" /><span>Source</span></a>
      </nav>
      <button type="button" className="bork-nav-link mt-2 text-left" onClick={toggleTheme}><Icon name="theme" /><span>{theme === "dark" ? "Light mode" : "Dark mode"}</span></button>
      <div className="mt-auto border-t pt-5 bork-divider">
        {user ? (
          <div>
            <div className="flex items-center gap-3">
              <ProfileAvatar src={profileImageUrl} username={username} size={42} />
              <div className="min-w-0">
                <Link className="block truncate text-sm font-bold hover:underline" href={`/@${username}`}>@{username}</Link>
                <p className="bork-muted truncate text-xs">{user.email}</p>
              </div>
            </div>
            <button type="button" className="bork-muted mt-4 text-sm font-semibold hover:underline" onClick={() => void supabase.auth.signOut()}>Sign out</button>
          </div>
        ) : (
          <div>
            <h2 className="text-base font-bold">Want to post?</h2>
            <p className="bork-muted mt-2 text-sm leading-5">Sign in by email. No password needed.</p>
            <Link href="/signin" className="bork-primary-btn mt-4 w-full">Sign in with email</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export const MobileHeader = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 md:hidden bork-divider bork-surface">
      <Brand />
      <button type="button" className="bork-secondary-btn !min-h-9 !px-3" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><Icon name="theme" /></button>
    </header>
  );
};

export const MobileNavigation = () => {
  const user = useUser();
  const router = useRouter();
  const username = userName(user);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid h-16 grid-cols-3 border-t md:hidden bork-divider bork-surface" aria-label="Mobile navigation">
      <Link href="/" className="bork-mobile-nav-link" aria-current={router.pathname === "/" ? "page" : undefined}><Icon name="feed" /><span>Feed</span></Link>
      <Link href={user ? `/@${username}` : "/signin"} className="bork-mobile-nav-link" aria-current={router.pathname === "/[slug]" || router.pathname === "/signin" ? "page" : undefined}><Icon name="profile" /><span>{user ? "Profile" : "Sign in"}</span></Link>
      <Link href="/UserSettingsPage" className="bork-mobile-nav-link" aria-current={router.pathname === "/UserSettingsPage" ? "page" : undefined}><Icon name="settings" /><span>Settings</span></Link>
    </nav>
  );
};

export default LeftBar;
