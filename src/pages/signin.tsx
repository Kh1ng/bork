import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/PageLayout";

const SignInPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMagicLink = async () => {
    if (!email) return;
    setIsSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined },
    });
    setIsSending(false);

    if (error) {
      toast.error(`Couldn’t send the magic link: ${error.message}`);
      return;
    }

    toast.success("Magic link sent. Check your inbox.");
    setEmail("");
  };

  if (user) {
    void router.replace("/");
    return null;
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-lg px-5 py-14 md:px-8 md:py-20">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Sign in to Bork</h1>
        <p className="bork-muted mt-3 max-w-[52ch] leading-7">Enter your email. Bork sends a one-time link. No password.</p>
        <form className="mt-9" onSubmit={(event) => { event.preventDefault(); void sendMagicLink(); }}>
          <label htmlFor="email" className="mb-2 block text-sm font-bold">Email address</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="bork-input" />
          <button type="submit" disabled={!email || isSending} className="bork-primary-btn mt-5">{isSending ? "Sending…" : "Send magic link"}</button>
        </form>
        <p className="bork-muted mt-8 border-t pt-5 text-sm leading-6 bork-divider">The feed is public. Sign in only if you want to post.</p>
      </div>
    </PageLayout>
  );
};

export default SignInPage;
