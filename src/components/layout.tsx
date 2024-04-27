import type { PropsWithChildren } from "react";
import LeftBar from "./LeftBar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <main className="flex h-screen justify-center overflow-hidden">
        <div className="flex h-full w-1/4 place-self-start text-slate-200">
          <LeftBar />
        </div>
        <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl">
          {props.children}
        </div>
        <div className="flex h-full w-1/4 place-self-end text-slate-100"></div>
      </main>
    </>
  );
};
