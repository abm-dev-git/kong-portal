import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dark-blue)]">
      <SignUp
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
