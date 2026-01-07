import { auth, currentUser } from '@clerk/nextjs/server'
import { DashboardContent } from '@/components/dashboard'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()
  const firstName = user?.firstName || 'there'

  return <DashboardContent firstName={firstName} />
}
