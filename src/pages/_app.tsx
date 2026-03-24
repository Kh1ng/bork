import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { initializeTheme } from "~/lib/theme";

interface AppProps {
  initialSession?: Session | null;
}

const MyApp: AppType<AppProps> = ({ Component, pageProps }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>Bork</title>
        <meta name="description" content="Social media for dog people" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Analytics />
      <Toaster />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
};

export default api.withTRPC(MyApp);
