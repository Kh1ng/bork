import { type NextPage } from "next";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bork</title>
        <meta name="description" content="Social media for dog people" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full">
          <h1>Profile View</h1>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
