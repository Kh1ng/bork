import Link from "next/link";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const LeftBar = () => {
  const { user } = useUser();
  if (!user?.username)
    return (
      <div className="flex h-full w-full flex-col pr-4 pt-4">
        <nav className="m-auto gap-2">
          <Link href="/">Home</Link>
          <Link className="flex" href="/about">
            About
          </Link>
          <Link className="flex" href="/users">
            Users
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
          <Link className="flex" href="/about">
            About
          </Link>
          <Link className="flex" href="/users">
            Users
          </Link>
        </nav>
        <div className="flex h-full w-full flex-col justify-end gap-2 pb-4 pl-2 align-text-bottom">
          <div className="flex flex-row justify-center ">
            <Image
              src={user?.imageUrl.toString()}
              className="h-14 w-14 rounded-full"
              alt={`@${user?.username.toString()}'s profile picture`}
              width={56}
              height={56}
            />
            <div className="justify-end pl-4 pr-2">
              <Link href={`/@${user.username}`}>
                <span>{`@${user.username} `}</span>
              </Link>
              <br />
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
};

export default LeftBar;
