import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      {...pageProps}
    >
      <Head>
        <title>Bork</title>
        <meta name="description" content="Social media for dog people" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <Analytics />
      </Head>
      {/* <Toaster /> */}
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
