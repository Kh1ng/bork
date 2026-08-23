import type { PropsWithChildren } from "react";
import LeftBar, { MobileHeader, MobileNavigation } from "./LeftBar";

const ProjectRail = () => (
  <div className="sticky top-0 flex max-h-screen flex-col gap-8 px-7 py-10">
    <section aria-labelledby="built-by-colton">
      <h2 id="built-by-colton" className="text-xl font-bold tracking-[-0.02em]">
        Built by Colton
      </h2>
      <p className="bork-muted mt-3 max-w-[28ch] text-sm leading-6">
        I built Bork because I like dogs and wanted to get better at web development.
      </p>
    </section>
    <section aria-labelledby="stack-heading" className="border-t pt-6 bork-divider">
      <h2 id="stack-heading" className="text-sm font-bold">Under the hood</h2>
      <ul className="bork-muted mt-3 space-y-2 text-sm" aria-label="Technology stack">
        <li>Next.js + TypeScript</li>
        <li>tRPC + Supabase</li>
        <li>Jest + GitHub Actions</li>
      </ul>
      <dl className="mt-5 grid gap-3 border-t pt-4 text-xs bork-divider">
        <div>
          <dt className="font-semibold">Database</dt>
          <dd className="bork-muted mt-1 leading-5">
            PlanetScale → Railway → Supabase, self-hosted in my homelab
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Auth</dt>
          <dd className="bork-muted mt-1 leading-5">Clerk → Supabase Auth</dd>
        </div>
      </dl>
    </section>
    <a className="bork-secondary-btn w-fit" href="https://github.com/kh1ng/bork" target="_blank" rel="noreferrer">
      View source
    </a>
  </div>
);

/** Owns the responsive shell: mobile chrome, feed lane, and desktop project rails. */
export const PageLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen pb-20 md:pb-0">
    <MobileHeader />
    <main className="mx-auto grid min-h-screen w-full max-w-[1230px] grid-cols-1 md:grid-cols-[220px_minmax(0,720px)] xl:grid-cols-[230px_minmax(0,720px)_280px]">
      <aside className="sticky top-0 hidden h-screen border-r md:block bork-divider">
        <LeftBar />
      </aside>
      <section className="min-w-0 border-x bork-divider md:min-h-screen">{children}</section>
      <aside className="hidden border-r xl:block bork-divider" aria-label="Project details">
        <ProjectRail />
      </aside>
    </main>
    <MobileNavigation />
  </div>
);
