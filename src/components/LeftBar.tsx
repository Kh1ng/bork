import Link from "next/link";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const LeftBar = () => {
  const { user } = useUser();
  if (!user?.username)
    return (
      <div className="flex h-full min-w-36 flex-col pr-4 pt-4">
        <nav className="m-auto gap-2">
          <Link href="/">Home</Link>
          <Link className="flex" href="https://github.com/kh1ng/bork">
            About
          </Link>
        </nav>
        <div className="flex h-full w-full flex-col justify-end gap-2 pb-4 pl-2 align-text-bottom"></div>
      </div>
    );
  else
    return (
      <div className="flex h-full w-full flex-col pt-4">
        <nav className="m-auto gap-2">
          <Link href="/">Home</Link>
          <Link className="flex" href="https://github.com/kh1ng/bork">
            About
          </Link>
        </nav>
        <div className="flex h-full min-w-24 flex-col justify-end gap-2 p-4 align-text-bottom">
          <div className="flex flex-row ">
            <div className="grid grid-cols-2 grid-rows-1 gap-1">
              <div>
                <Image
                  src={user?.imageUrl.toString()}
                  className="flex h-14 w-14 place-self-center self-center rounded-full"
                  alt={`@${user?.username.toString()}'s profile picture`}
                  width={56}
                  height={56}
                />

                <Link className="" href={`/@${user.username}`}>
                  {`@${user.username} `}
                </Link>
              </div>
              <div className="self-end">
                <Link className="" href="UserSettingsPage">
                  Account
                </Link>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default LeftBar;
