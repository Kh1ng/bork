import type { PropsWithChildren } from "react";
import LeftBar from "./LeftBar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl justify-center px-2 py-4 md:px-4">
        <div className="hidden h-full w-1/4 max-w-xs place-self-start md:flex">
          <LeftBar />
        </div>
        <div className="tw-panel flex h-full w-full flex-col border md:max-w-2xl">
          {props.children}
        </div>
        <div className="hidden h-full w-1/4 md:flex" />
      </main>
    </>
  );
};
