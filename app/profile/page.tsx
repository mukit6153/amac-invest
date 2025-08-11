import ProfileScreen from '@/app/components/profile-screen'
import { authFunctions } from '@/app/lib/database' // Assuming authFunctions are client-side safe
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '@/app/lib/database' // Import User type

export default async function ProfilePage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('currentUserId')?.value

  let user: User | null = null
  if (userId) {
    user = await authFunctions.getCurrentUser(userId)
  }

  if (!user) {
    redirect('/auth/login')
  }

  return <ProfileScreen user={user} onUserUpdate={() => { /* client-side update logic */ }} />
}
