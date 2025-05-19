'use client'

import { useRouter } from 'next/navigation'
import { buttonVariants } from './ui/Button'

export default function SignInButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/sign-in')}
      className={buttonVariants()}
    >
      Sign In
    </button>
  )
}
