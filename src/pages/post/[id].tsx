import { type NextPage } from "next";
import Head from "next/head";

const SinglePost: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
        <meta name="description" content="Social media for dog people" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full">
          <h1>Single Post</h1>
        </div>
      </main>
    </>
  );
};

export default SinglePost;
