import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dark-blue)]">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[var(--navy)] border border-[var(--turquoise)]/20",
          }
        }}
      />
    </div>
  )
}
