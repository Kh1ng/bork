import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PageLayout } from '~/components/layout'

const SignInPage: NextPage = () => {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)

  const sendMagicLink = async () => {
    if (!email) return

    setIsSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email for a magic link.')
      setEmail('')
    }

    setIsSending(false)
  }

  if (user) {
    void router.replace('/')
    return null
  }

  return (
    <PageLayout>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
        <h1 className="tw-heading text-2xl font-bold">Sign in</h1>
        <p className="text-sm tw-muted">Enter your email and we will send a magic link.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@bork.com"
          className="tw-input"
        />
        <button
          type="button"
          onClick={() => void sendMagicLink()}
          disabled={!email || isSending}
          className="tw-primary-btn w-fit"
        >
          {isSending ? 'sending...' : 'send magic link'}
        </button>
      </div>
    </PageLayout>
  )
}

export default SignInPage
