import AdminPanelScreen from '@/app/components/admin-panel-screen'
import { authFunctions } from '@/app/lib/database' // Assuming authFunctions are client-side safe
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '@/app/lib/database' // Import User type

export default async function AdminPanelPage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('currentUserId')?.value

  let user: User | null = null
  if (userId) {
    user = await authFunctions.getCurrentUser(userId)
  }

  if (!user || !user.is_admin) {
    redirect('/auth/login') // Redirect if not logged in or not an admin
  }

  return <AdminPanelScreen user={user} />
}
